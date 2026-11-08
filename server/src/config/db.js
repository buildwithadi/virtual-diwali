import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve paths for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../../server/database/diwali.db');

const db = new Database(dbPath, { verbose: console.log });

// Enforce foreign key constraints
db.pragma('foreign_keys = ON');

export const initDB = () => {
    const createTables = `
        CREATE TABLE IF NOT EXISTS Users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Rooms (
            id TEXT PRIMARY KEY,
            room_code TEXT UNIQUE NOT NULL,
            room_name TEXT NOT NULL,
            created_by TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Game_Events (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            room_id TEXT,
            event_type TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES Users(id),
            FOREIGN KEY(room_id) REFERENCES Rooms(id)
        );
    `;
    
    try {
        db.exec(createTables);
        console.log('SQLite database and schema initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
};

export default db;