import * as userService from '../services/userService.js';

export const registerUser = (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Auto-generate a dummy email to satisfy the existing DB schema
    const dummyEmail = `${username.toLowerCase().replace(/\s+/g, '')}_${Date.now()}@virtual-diwali.local`;

    try {
        const user = userService.registerOrGetUser(username, dummyEmail);
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
        
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};