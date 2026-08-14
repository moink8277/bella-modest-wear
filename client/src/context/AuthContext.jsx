import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authService from '@/services/authService';

const AuthContext = createContext(null);
const TOKEN_KEY = 'bmw_access_token';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            setIsLoading(false);
            return;
        }

        authService
            .getCurrentUser()
            .then((res) => setUser(res.data))
            .catch(() => {
                localStorage.removeItem(TOKEN_KEY);
                setUser(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const login = useCallback(async (credentials) => {
        const res = await authService.login(credentials);
        localStorage.setItem(TOKEN_KEY, res.data.accessToken);
        setUser(res.data.user);
        return res.data.user;
    }, []);

    const register = useCallback(async (payload) => {
        const res = await authService.register(payload);
        localStorage.setItem(TOKEN_KEY, res.data.accessToken);
        setUser(res.data.user);
        return res.data.user;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            localStorage.removeItem(TOKEN_KEY);
            setUser(null);
        }
    }, []);

    const value = { user, isAuthenticated: !!user, isLoading, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an <AuthProvider>');
    }
    return ctx;
}