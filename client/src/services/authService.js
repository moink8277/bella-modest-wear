import api from './api';

export async function register({ name, email, password }) {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
}

export async function login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
}

export async function logout() {
    const { data } = await api.post('/auth/logout');
    return data;
}

export async function refreshToken() {
    const { data } = await api.post('/auth/refresh');
    return data;
}

export async function getCurrentUser() {
    const { data } = await api.get('/auth/me');
    return data;
}

export async function forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
}

export async function resetPassword({ token, password }) {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data;
}

export async function verifyEmail(token) {
    const { data } = await api.post('/auth/verify-email', { token });
    return data;
}