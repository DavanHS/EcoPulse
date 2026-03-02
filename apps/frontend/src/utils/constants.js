// ── API Base URL ──────────────────────────────────────
export const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── AQI Thresholds & Labels ──────────────────────────
export const AQI_LEVELS = [
    { max: 50, label: 'Good', color: '#22c55e', bgClass: 'bg-aqi-good/15', textClass: 'text-aqi-good' },
    { max: 100, label: 'Moderate', color: '#eab308', bgClass: 'bg-aqi-moderate/15', textClass: 'text-aqi-moderate' },
    { max: 150, label: 'Unhealthy for Sensitive', color: '#f97316', bgClass: 'bg-aqi-sensitive/15', textClass: 'text-aqi-sensitive' },
    { max: 200, label: 'Unhealthy', color: '#ef4444', bgClass: 'bg-aqi-unhealthy/15', textClass: 'text-aqi-unhealthy' },
    { max: 300, label: 'Very Unhealthy', color: '#a855f7', bgClass: 'bg-aqi-very-unhealthy/15', textClass: 'text-aqi-very-unhealthy' },
    { max: Infinity, label: 'Hazardous', color: '#e11d48', bgClass: 'bg-aqi-hazardous/15', textClass: 'text-aqi-hazardous' },
];

/**
 * Get the AQI level info for a given AQI value.
 */
export function getAqiLevel(value) {
    return AQI_LEVELS.find((level) => value <= level.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
}

// ── Bengaluru Localities ─────────────────────────────
export const BENGALURU_LOCALITIES = [
    'Indiranagar',
    'Whitefield',
    'Koramangala',
    'Jayanagar',
    'Mathikere',
    'Rajajinagar',
    'HSR Layout',
    'Electronic City',
    'Marathahalli',
    'Yelahanka',
    'Hebbal',
    'Banashankari',
    'BTM Layout',
    'JP Nagar',
    'Malleshwaram',
];

// ── Pollutant labels ─────────────────────────────────
export const POLLUTANT_LABELS = {
    pm25: 'PM₂.₅',
    no2: 'NO₂',
    aqi: 'AQI',
};
