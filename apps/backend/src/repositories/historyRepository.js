import mongoose from 'mongoose';
import SearchHistory from '../models/SearchHistory.js';

export const historyRepository = {
    async create(historyData) {
        return await SearchHistory.create(historyData);
    },

    async findByUserId(userId, limit = 50) {
        return await SearchHistory.find({ userId })
            .sort({ timestamp: -1 })
            .limit(limit);
    },

    async findByLocation(userId, location) {
        return await SearchHistory.find({
            userId,
            locationSearched: { $regex: location, $options: 'i' }
        }).sort({ timestamp: -1 });
    },

    async findById(id) {
        return await SearchHistory.findById(id);
    },

    async deleteById(id) {
        return await SearchHistory.findByIdAndDelete(id);
    },

    async deleteAllByUserId(userId) {
        return await SearchHistory.deleteMany({ userId });
    },

    async getStatsByUserId(userId) {
        return await SearchHistory.aggregate([
            { $match: { userId: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
            {
                $group: {
                    _id: '$locationSearched',
                    avgAqi: { $avg: '$aqiValue' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
    }
};