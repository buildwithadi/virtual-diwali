import db from '../config/db.js';
import crypto from 'crypto';

export const createRoom = (roomName, createdBy) => {
    const id = crypto.randomUUID();
    const roomCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // e.g., "A1B2C3"
    
    db.prepare('INSERT INTO Rooms (id, room_code, room_name, created_by) VALUES (?, ?, ?, ?)')
      .run(id, roomCode, roomName, createdBy);
      
    return { id, room_code: roomCode, room_name: roomName, created_by: createdBy };
};

export const getRoomByCode = (roomCode) => {
    return db.prepare('SELECT * FROM Rooms WHERE room_code = ?').get(roomCode);
};

export const logGameEvent = (userId, roomId, eventType) => {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO Game_Events (id, user_id, room_id, event_type) VALUES (?, ?, ?, ?)')
      .run(id, userId, roomId, eventType);
};