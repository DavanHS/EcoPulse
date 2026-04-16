import api from '../api/axios';

export const authService = {
    async register({ username, email, password, defaultLocation }) {
        console.log('[AUTH] Register request:', { username, email, defaultLocation });
        const { data } = await api.post('/api/auth/register', {
            username,
            email,
            password,
            defaultLocation,
        });
        console.log('[AUTH] Register response:', data);
        return data;
    },

    async login({ email, password }) {
        const { data } = await api.post('/api/auth/login', { email, password });
        return data;
    },
};
