import User from '../models/User.js';

export const userRepository = {
    async create(userData) {
        console.log('[USER REPO] Creating user with data:', { username: userData.username, email: userData.email });
        try {
            const user = await User.create(userData);
            console.log('[USER REPO] User created successfully:', user._id);
            return user;
        } catch (err) {
            console.log('[USER REPO] Create error:', err.message);
            throw err;
        }
    },

    async findByEmail(email) {
        return await User.findOne({ email }).select('+password');
    },

    async findById(id) {
        return await User.findById(id);
    },

    async findByIdWithPassword(id) {
        return await User.findById(id).select('+password');
    },

    async updateById(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    },

    async deleteById(id) {
        return await User.findByIdAndDelete(id);
    },

    async findAll() {
        return await User.find();
    }
};