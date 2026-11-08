import * as userService from '../services/userService.js';

export const registerUser = (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        const user = userService.registerOrGetUser(username, email);
        res.status(200).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUser = (req, res) => {
    const { id } = req.params;
    
    try {
        const user = userService.getUserById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        // Don't send sensitive info if not needed, though we just have email
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};