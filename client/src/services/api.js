import axios from 'axios';

// Automatically use the production URL if deployed, otherwise use localhost
const API_URL = import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/api` 
    : 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const registerUser = async (username, email) => {
    try {
        const response = await api.post('/users/register', { username, email });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to register';
    }
};