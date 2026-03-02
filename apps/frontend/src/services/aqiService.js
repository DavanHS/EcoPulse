import api from '../api/axios';

export const aqiService = {
    async getCurrentAqi(location) {
        const { data } = await api.get('/api/aqi/current', {
            params: { location },
        });
        return data;
        // Expected shape:
        // {
        //   location, aqi, pm25, no2, dominantPollutant,
        //   geminiAdvisory: { riskLevel, advisoryMessage }
        // }
    },
};
