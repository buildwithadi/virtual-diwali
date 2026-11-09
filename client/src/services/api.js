import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/api` 
    : 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Removed email parameter
export const registerUser = async (username) => {
    try {
        const response = await api.post('/users/register', { username });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to register';
    }
};