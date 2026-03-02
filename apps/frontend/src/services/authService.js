import api from '../api/axios';

export const authService = {
    async register({ username, email, password, defaultLocation }) {
        const { data } = await api.post('/api/auth/register', {
            username,
            email,
            password,
            defaultLocation,
        });
        return data; // { token, user }
    },

    async login({ email, password }) {
        const { data } = await api.post('/api/auth/login', { email, password });
        return data; // { token, user }
    },
};
