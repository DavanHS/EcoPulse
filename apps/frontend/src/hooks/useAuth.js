import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    // --- ORIGINAL CODE ---
    // return context;

    // --- BYPASS ---
    return {
        ...context,
        isAuthenticated: true,
        user: { username: 'GuestReviewer', email: 'guest@example.com' },
        loading: false
    };
}
