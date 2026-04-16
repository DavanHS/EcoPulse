import { historyRepository } from '../repositories/historyRepository.js';

export const userService = {
    async getHistory(userId) {
        const history = await historyRepository.findByUserId(userId);
        return history;
    },

    async saveSearch(userId, { locationSearched, aqiValue, dominantPollutant, aiRiskLevel, pm25, no2 }) {
        const history = await historyRepository.create({
            userId,
            locationSearched,
            aqiValue,
            dominantPollutant,
            aiRiskLevel,
            pm25,
            no2
        });
        return history;
    },

    async deleteHistoryEntry(historyId, userId) {
        const history = await historyRepository.findById(historyId);
        if (!history) {
            throw new Error('History entry not found');
        }
        if (history.userId.toString() !== userId.toString()) {
            throw new Error('Not authorized to delete this entry');
        }
        return await historyRepository.deleteById(historyId);
    },

    async getStats(userId) {
        return await historyRepository.getStatsByUserId(userId);
    }
};

export default userService;