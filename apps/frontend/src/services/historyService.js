import api from '../api/axios';

export const historyService = {
    async getHistory() {
        const { data } = await api.get('/api/user/history');
        return data;
        // Expected: array of { _id, locationSearched, aqiValue, dominantPollutant, aiRiskLevel, timestamp }
    },

    async saveSearch({ locationSearched, aqiValue, dominantPollutant, aiRiskLevel }) {
        const { data } = await api.post('/api/user/history', {
            locationSearched,
            aqiValue,
            dominantPollutant,
            aiRiskLevel,
        });
        return data;
    },
};
