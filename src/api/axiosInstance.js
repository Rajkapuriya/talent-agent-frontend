import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30_000,
});

api.interceptors.request.use(config => {
    // Read token from persisted Zustand store (localStorage)
    try {
        const raw = localStorage.getItem('talent_agent_auth');
        const state = raw ? JSON.parse(raw) : {};
        const token = state?.state?.token;
        if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (_) { }
    return config;
});

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('talent_agent_auth');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default api;