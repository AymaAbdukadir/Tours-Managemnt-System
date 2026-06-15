import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';
const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper for image URLs
export const getImageUrl = (path, type = 'tours') => {
    if (!path) return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}/img/${type}/${path}`;
};

// ... existing interceptor code ...
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
