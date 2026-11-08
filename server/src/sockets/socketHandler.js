import * as userService from '../services/userService.js';
import * as roomService from '../services/roomService.js';

// Server memory to track online users: { socketId: { userId, username, roomCode } }
const onlineUsers = new Map();

export const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        
        // 1. Join Room
        socket.on('join-room', (payload) => {
            const { userId, roomCode } = payload;
            
            // Validate user against DB securely
            const user = userService.getUserById(userId);
            if (!user) {
                socket.emit('error', { message: 'Invalid user session' });
                return;
            }

            // Track in memory
            onlineUsers.set(socket.id, { userId: user.id, username: user.username, roomCode });
            socket.join(roomCode);

            // Notify client they joined successfully
            socket.emit('room-joined', { roomCode, userId: user.id });

            // Broadcast to others in the room
            socket.to(roomCode).emit('user-joined', { 
                userId: user.id, 
                username: user.username,
                timestamp: new Date().toISOString()
            });

            // Send current room state (active user count, etc.)
            const usersInRoom = Array.from(onlineUsers.values()).filter(u => u.roomCode === roomCode);
            io.to(roomCode).emit('room-state', {
                onlineCount: usersInRoom.length,
                users: usersInRoom.map(u => ({ userId: u.userId, username: u.username }))
            });
        });

        // 2. Launch Firecracker
        socket.on('launch-firecracker', (payload) => {
            const { firecrackerType } = payload;
            const session = onlineUsers.get(socket.id);
            
            if (!session) return; // Unauthenticated socket

            // Optional: Rate limiting can be added here using memory timestamps

            const { userId, username, roomCode } = session;

            // Log event in SQLite asynchronously
            const room = roomService.getRoomByCode(roomCode);
            if (room) {
                roomService.logGameEvent(userId, room.id, firecrackerType);
            }

            // Broadcast animation to everyone in the room (including sender if desired, 
            // or use socket.to() if client handles their own locally)
            io.to(roomCode).emit('firecracker-launched', {
                userId,
                username,
                firecrackerType,
                timestamp: new Date().toISOString()
            });
        });

        // 3. Disconnect
        socket.on('disconnect', () => {
            const session = onlineUsers.get(socket.id);
            if (session) {
                const { userId, username, roomCode } = session;
                
                // Remove from memory
                onlineUsers.delete(socket.id);
                
                // Notify room
                socket.to(roomCode).emit('user-left', { 
                    userId, 
                    username,
                    timestamp: new Date().toISOString()
                });

                // Update room state
                const usersInRoom = Array.from(onlineUsers.values()).filter(u => u.roomCode === roomCode);
                io.to(roomCode).emit('room-state', {
                    onlineCount: usersInRoom.length,
                    users: usersInRoom.map(u => ({ userId: u.userId, username: u.username }))
                });
            }
        });
    });
};