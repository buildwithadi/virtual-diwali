import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';

// Import Socket setup
import { setupSocketHandlers } from './sockets/socketHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Initialize DB
initDB();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Initialize Socket Events
setupSocketHandlers(io);

// Start Server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 