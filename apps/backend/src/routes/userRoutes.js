import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { userService } from '../services/userService.js';

const router = express.Router();

router.get('/history', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const history = await userService.getHistory(userId);
        
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/history', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const { locationSearched, aqiValue, dominantPollutant, aiRiskLevel, pm25, no2 } = req.body;

        if (!locationSearched || !aqiValue || !dominantPollutant) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const history = await userService.saveSearch(userId, {
            locationSearched,
            aqiValue,
            dominantPollutant,
            aiRiskLevel: aiRiskLevel || null,
            pm25,
            no2
        });
        
        res.status(201).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/history/:id', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const historyId = req.params.id;
        
        await userService.deleteHistoryEntry(historyId, userId);
        
        res.json({ message: 'History entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/stats', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const stats = await userService.getStats(userId);
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;