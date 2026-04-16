import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const WAQI_BASE_URL = 'https://api.waqi.info/feed';
const WAQI_MAP_URL = 'https://api.waqi.info/map/bounds';

const CITY_AQI_CACHE = {};
let lastCallTime = 0;
const MIN_CALL_INTERVAL = 2000;

let STATIONS_CACHE = null;
let STATIONS_CACHE_TIME = 0;
const CACHE_TTL = 3600000;

export function clearStationCache() {
    STATIONS_CACHE = null;
    STATIONS_CACHE_TIME = 0;
}

export function clearCityCache() {
    Object.keys(CITY_AQI_CACHE).forEach(key => delete CITY_AQI_CACHE[key]);
}

async function fetchStations() {
    const now = Date.now();
    if (STATIONS_CACHE && now - STATIONS_CACHE_TIME < CACHE_TTL) {
        return STATIONS_CACHE;
    }
    
    const token = process.env.WAQI_TOKEN;
    
    try {
        const latlng = '12.5,77.0,13.5,77.8';
        const url = `${WAQI_MAP_URL}/?token=${token}&latlng=${latlng}`;
        
        const response = await throttledCall(url);
        
        if (response.data.status === 'ok' && response.data.data) {
            const data = response.data.data;
            const stationArray = typeof data === 'object' && !Array.isArray(data) 
                ? Object.values(data) 
                : data;
            
            const stations = (Array.isArray(stationArray) ? stationArray : [])
                .filter(s => s.lat && s.lon && s.aqi && s.aqi !== '-')
                .map(s => ({
                    uid: s.uid,
                    name: s.station?.name || `Station ${s.uid}`,
                    lat: s.lat,
                    lng: s.lon,
                    aqi: s.aqi
                }));
            
            STATIONS_CACHE = stations;
            STATIONS_CACHE_TIME = now;
            return stations;
        }
    } catch (error) {
        console.error('Error fetching stations:', error.message);
    }
    
    return [];
}

function findNearestStation(targetLat, targetLng, stations) {
    if (!stations?.length) return null;
    
    let nearest = null;
    let minDistance = Infinity;
    
    for (const station of stations) {
        const distance = calculateDistance(targetLat, targetLng, station.lat, station.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = station;
        }
    }
    
    return nearest ? { station: nearest, distance: minDistance } : null;
}

async function getAqiByStationUid(uid) {
    const token = process.env.WAQI_TOKEN;
    
    try {
        const url = `${WAQI_BASE_URL}/@${uid}/?token=${token}`;
        const response = await throttledCall(url);
        
        if (response.data.status === 'ok' && response.data.data) {
            return response.data.data;
        }
    } catch (e) {
        console.error('UID endpoint failed:', e.message);
    }
    
    const station = STATIONS_CACHE?.find(s => s.uid === uid);
    if (station) {
        const geoUrl = `${WAQI_BASE_URL}/geo:${station.lat};${station.lng}/?token=${token}`;
        const geoResponse = await throttledCall(geoUrl);
        if (geoResponse.data.status === 'ok' && geoResponse.data.data) {
            return geoResponse.data.data;
        }
    }
    
    return null;
}

function isIndia(lat, lng) {
    return lat >= 6.0 && lat <= 37.0 && lng >= 68.0 && lng <= 98.0;
}

async function resolveToCity(location) {
    const normalized = location.toLowerCase().trim();
    const cityNames = ['bengaluru', 'bangalore', 'mumbai', 'delhi', 'chennai', 'hyderabad', 'kolkata', 'pune'];
    const isMajorCity = cityNames.includes(normalized);
    
    if (isMajorCity) {
        return null;
    }
    
    let geoCoords = null;
    
    try {
        const response = await axios.get(NOMINATIM_URL, {
            params: { q: `${location}, India`, format: 'json', limit: 1, countrycodes: 'in' },
            headers: { 'User-Agent': 'EcoPulse/1.0' },
            timeout: 10000
        });
        
        if (response.data?.length > 0) {
            const lat = parseFloat(response.data[0].lat);
            const lng = parseFloat(response.data[0].lon);
            geoCoords = { lat, lng };
        }
    } catch (error) {
        console.error('Geocoding error:', error.message);
    }
    
    if (!geoCoords) {
        return null;
    }
    
    const stations = await fetchStations();
    const result = findNearestStation(geoCoords.lat, geoCoords.lng, stations);
    
    if (result) {
        return {
            stationUid: result.station.uid,
            stationName: result.station.name,
            lat: result.station.lat,
            lng: result.station.lng,
            distance: result.distance
        };
    }
    
    return null;
}

async function getAqiByGeo(lat, lng) {
    const token = process.env.WAQI_TOKEN;
    const response = await throttledCall(`${WAQI_BASE_URL}/geo:${lat};${lng}/?token=${token}`);
    
    if (response.data.status === 'ok' && response.data.data) {
        return response.data.data;
    }
    
    return null;
}

async function throttledCall(url, options = {}) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    if (timeSinceLastCall < MIN_CALL_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, MIN_CALL_INTERVAL - timeSinceLastCall));
    }
    lastCallTime = Date.now();
    return axios.get(url, { ...options, timeout: 10000 });
}

function formatResponse(data, requestedCity) {
    return {
        aqi: data.aqi,
        location: requestedCity,
        stationLocation: data.city?.name || 'Unknown Station',
        stationCoords: data.city?.geo || [0, 0],
        dominantPollutant: data.dominantpol || 'pm25',
        pm25: data.iaqi?.pm25?.v || null,
        pm10: data.iaqi?.pm10?.v || null,
        no2: data.iaqi?.no2?.v || null,
        so2: data.iaqi?.so2?.v || null,
        o3: data.iaqi?.o3?.v || null,
        co: data.iaqi?.co?.v || null,
        timestamp: data.time?.iso,
        userCoords: null,
        distanceKm: 0,
        accuracy: 'high',
        isEstimated: false,
        nearestCity: null
    };
}

export const waqiService = {
    async getAqiByCity(city) {
        const cityLower = city.toLowerCase().trim();

        const cacheKey = cityLower;
        if (CITY_AQI_CACHE[cacheKey] && Date.now() - CITY_AQI_CACHE[cacheKey].timestamp < 300000) {
            return CITY_AQI_CACHE[cacheKey].data;
        }

        let aqiData = null;
        
        const stationInfo = await resolveToCity(city);
        
        if (stationInfo) {
            aqiData = await getAqiByStationUid(stationInfo.stationUid);
        }
        
        if (!aqiData) {
            const token = process.env.WAQI_TOKEN;
            try {
                const response = await throttledCall(`${WAQI_BASE_URL}/${cityLower}/?token=${token}`);
                
                if (response.data.status === 'ok' && response.data.data) {
                    const data = response.data.data;
                    const cityGeo = data.city?.geo;
                    
                    if (cityGeo && isIndia(cityGeo[0], cityGeo[1])) {
                        aqiData = data;
                    }
                }
            } catch (error) {
                console.error('Direct search error:', error.message);
            }
        }
        
        if (!aqiData) {
            const token = process.env.WAQI_TOKEN;
            try {
                const response = await throttledCall(`${WAQI_BASE_URL}/bengaluru/?token=${token}`);
                
                if (response.data.status === 'ok' && response.data.data) {
                    const data = response.data.data;
                    const cityGeo = data.city?.geo;
                    
                    if (cityGeo && isIndia(cityGeo[0], cityGeo[1])) {
                        aqiData = data;
                    }
                }
            } catch (error) {
                console.error('Fallback error:', error.message);
            }
        }
        
        if (aqiData) {
            const formatted = formatResponse(aqiData, city);
            
            const cityGeo = aqiData.city?.geo;
            if (cityGeo) {
                formatted.stationCoords = cityGeo;
                
                if (stationInfo?.distance) {
                    formatted.distanceKm = Math.round(stationInfo.distance);
                    formatted.accuracy = stationInfo.distance < 3 ? 'high' : stationInfo.distance < 10 ? 'moderate' : 'low';
                } else {
                    formatted.accuracy = 'high';
                }
            }
            
            CITY_AQI_CACHE[cacheKey] = { data: formatted, timestamp: Date.now() };
            return formatted;
        }

        throw new Error('No air quality data available for this location.');
    },

    async searchStations(query) {
        return [];
    }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}