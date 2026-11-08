import db from '../config/db.js';
import crypto from 'crypto';

export const registerOrGetUser = (username, email) => {
    // Check if user exists
    const existingUser = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
    
    if (existingUser) {
        // Update username if it changed, but keep the ID and email
        if (existingUser.username !== username) {
            db.prepare('UPDATE Users SET username = ? WHERE email = ?').run(username, email);
            existingUser.username = username;
        }
        return existingUser;
    }

    // Create new user
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO Users (id, username, email) VALUES (?, ?, ?)')
      .run(id, username, email);
    
    return { id, username, email };
};

export const getUserById = (id) => {
    return db.prepare('SELECT * FROM Users WHERE id = ?').get(id);
};