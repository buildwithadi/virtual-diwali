import * as roomService from '../services/roomService.js';

export const createRoom = (req, res) => {
    const { roomName, userId } = req.body;
    
    if (!roomName) return res.status(400).json({ error: 'Room name is required' });

    try {
        const room = roomService.createRoom(roomName, userId);
        res.status(201).json({ message: 'Room created successfully', room });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getRoom = (req, res) => {
    const { roomCode } = req.params;
    
    try {
        const room = roomService.getRoomByCode(roomCode);
        if (!room) return res.status(404).json({ error: 'Room not found' });
        
        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};