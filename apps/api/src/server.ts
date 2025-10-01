import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from "./app.ts";
import {Database} from "./db/connection.ts";
import env from "../env.ts";
import process from "node:process";
import mongoose from "mongoose";
import {Initiator} from "./initiator.ts";
import jwt from 'jsonwebtoken';
import { UserModel } from './db/models/user.model.ts';
import { WebSocketService } from "./services/websocket.service.ts";


// Create HTTP server
const server = createServer(app);

// Create Socket.IO server
export const io = new SocketIOServer(server, {
    cors: {
        origin: env.CORS_ORIGIN.split(","),
        methods: ["GET", "POST"],
        credentials: true
    }
});
export const wsService = new WebSocketService();
wsService.init(io);

// Socket.IO authentication middleware
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        const jwtSecret = env.ACCESS_TOKEN_SECRET;
        const payload = jwt.verify(token, jwtSecret) as any;
        
        if (!payload._id) {
            return next(new Error('Authentication error: Invalid token'));
        }

        const user = await UserModel.findById(payload._id);
        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }

        socket.userId = payload._id;
        next();
    } catch (error) {
        next(new Error('Authentication error: Invalid token'));
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);
    
    // Join user-specific room
    socket.join(`user_${socket.userId}`);
    
    wsService.sendNotification(socket.userId!, {
        type: "follow",
        senderUsername: "system",
        senderId: "0",
        timestamp: new Date().toISOString(),
    });


    socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected`);
    });
});

export const initiator = new Initiator();
initiator.setupServices();
initiator.setupControllers();

(async () => {
    try {
        await Database.getInstance();
        server.listen(env.PORT, () => console.log(`Server running on ${env.PORT}`));
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
})();

/* ---- PROCESS ERRORS ---- */
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await mongoose.connection.close();
    console.log("MongoDB disconnected due to SIGTERM");
    process.exit(0);
});
