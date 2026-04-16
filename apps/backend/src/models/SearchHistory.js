import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    locationSearched: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    aqiValue: {
        type: Number,
        required: [true, 'AQI value is required']
    },
    dominantPollutant: {
        type: String,
        required: [true, 'Dominant pollutant is required'],
        enum: ['pm25', 'pm10', 'no2', 'so2', 'o3', 'co']
    },
    aiRiskLevel: {
        type: Number,
        default: null,
        min: 1,
        max: 5
    },
    pm25: {
        type: Number,
        default: null
    },
    no2: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
});

searchHistorySchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('SearchHistory', searchHistorySchema);