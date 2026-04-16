import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';

export const authService = {
    async register({ username, email, password, defaultLocation }) {
        console.log('[AUTH SERVICE] register called with:', { username, email, defaultLocation });
        
        const existingUser = await userRepository.findByEmail(email);
        console.log('[AUTH SERVICE] existingUser:', existingUser ? 'found' : 'not found');
        
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        console.log('[AUTH SERVICE] Creating user...');
        const user = await userRepository.create({
            username,
            email,
            password,
            defaultLocation
        });
        console.log('[AUTH SERVICE] User created:', user._id);

        return {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                defaultLocation: user.defaultLocation
            },
            token: this.generateToken(user._id)
        };
    },

    async login({ email, password }) {
        const user = await userRepository.findByEmail(email);
        
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.matchPassword(password);
        
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                defaultLocation: user.defaultLocation
            },
            token: this.generateToken(user._id)
        };
    },

    generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
    },

    verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    },

    async getUserById(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return {
            _id: user._id,
            username: user.username,
            email: user.email,
            defaultLocation: user.defaultLocation
        };
    }
};