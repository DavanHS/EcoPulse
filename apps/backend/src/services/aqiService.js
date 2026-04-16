import { waqiService } from './waqiService.js';
import { geminiService } from './geminiService.js';

export const aqiService = {
    async getCurrentAqi(location) {
        const aqiData = await waqiService.getAqiByCity(location);
        
        const advisory = await geminiService.generateAdvisory({
            pm25: aqiData.pm25,
            no2: aqiData.no2,
            so2: aqiData.so2,
            o3: aqiData.o3,
            co: aqiData.co,
            aqi: aqiData.aqi,
            location: aqiData.location
        });

        return {
            location: aqiData.location,
            aqi: aqiData.aqi,
            pm25: aqiData.pm25,
            pm10: aqiData.pm10,
            no2: aqiData.no2,
            so2: aqiData.so2,
            o3: aqiData.o3,
            co: aqiData.co,
            dominantPollutant: aqiData.dominantPollutant,
            stationLocation: aqiData.stationLocation,
            stationCoords: aqiData.stationCoords,
            userCoords: aqiData.userCoords,
            distanceKm: aqiData.distanceKm,
            accuracy: aqiData.accuracy,
            isEstimated: aqiData.isEstimated,
            nearestCity: aqiData.nearestCity,
            geminiAdvisory: advisory,
            timestamp: aqiData.timestamp
        };
    },

    async compareLocations(loc1, loc2) {
        const [data1, data2] = await Promise.all([
            this.getCurrentAqi(loc1),
            this.getCurrentAqi(loc2)
        ]);

        return {
            location1: data1,
            location2: data2,
            comparison: {
                better: data1.aqi < data2.aqi ? data1.location : data2.location,
                difference: Math.abs(data1.aqi - data2.aqi)
            }
        };
    }
};

export default aqiService;