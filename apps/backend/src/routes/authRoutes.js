import express from 'express';
import { authService } from '../services/authService.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, defaultLocation } = req.body;

        console.log('[REGISTER] Received:', { username, email, defaultLocation });

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide username, email and password' });
        }

        console.log('[REGISTER] Calling authService.register');
        const result = await authService.register({ username, email, password, defaultLocation });
        
        console.log('[REGISTER] Success:', result.user);
        res.status(201).json(result);
    } catch (error) {
        console.log('[REGISTER] Error:', error.message);
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const result = await authService.login({ email, password });
        
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const decoded = authService.verifyToken(token);
        const user = await authService.getUserById(decoded.id);
        
        res.json(user);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

export default router;