import express from 'express';
import { aqiService } from '../services/aqiService.js';
import { clearStationCache, clearCityCache } from '../services/waqiService.js';

const router = express.Router();

router.get('/debug/clear-cache', (req, res) => {
    clearStationCache();
    clearCityCache();
    res.json({ message: 'Cache cleared' });
});

router.get('/current', async (req, res) => {
    try {
        const { location } = req.query;

        if (!location) {
            return res.status(400).json({ message: 'Please provide a location' });
        }

        const result = await aqiService.getCurrentAqi(location);
        
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/compare', async (req, res) => {
    try {
        const { loc1, loc2 } = req.query;

        if (!loc1 || !loc2) {
            return res.status(400).json({ message: 'Please provide two locations to compare' });
        }

        const result = await aqiService.compareLocations(loc1, loc2);
        
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;