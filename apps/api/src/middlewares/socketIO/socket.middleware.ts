import { Server as SocketIOServer } from "socket.io";
import { verifyAndLoadUser } from "../auth.util.ts";

export function registerSocketHandlers(io: SocketIOServer) {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token
                || socket.handshake.headers.authorization?.replace("Bearer ", "");

            const { id } = await verifyAndLoadUser(token);

            // attach to socket for later use
            (socket as any).userId = id;
            next();
        } catch {
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        const userId = (socket as any).userId;
        console.log(`User ${userId} connected`);
        
        // Join user-specific room
        socket.join(`user_${userId}`);

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
        });
    });
}