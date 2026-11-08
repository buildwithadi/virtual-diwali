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

// Temporary Root Landing Page for the Backend
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Virtual Diwali API</title>
                <style>
                    body { 
                        background-color: #02010a; 
                        color: #ff7a00; 
                        font-family: system-ui, sans-serif; 
                        display: flex; 
                        flex-direction: column;
                        justify-content: center; 
                        align-items: center; 
                        height: 100vh; 
                        margin: 0; 
                    }
                    h1 { font-weight: 300; letter-spacing: 2px; }
                    p { color: #888; font-weight: 300; letter-spacing: 1px; }
                    .spark { font-size: 2rem; animation: pulse 2s infinite; }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.5; transform: scale(1.1); }
                    }
                </style>
            </head>
            <body>
                <div class="spark">✨</div>
                <h1>Virtual Diwali API</h1>
                <p>Backend Server & WebSockets are running successfully.</p>
            </body>
        </html>
    `);
});

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