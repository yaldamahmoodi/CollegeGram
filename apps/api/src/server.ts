import { Database } from "./db/connection.ts";
import env from "../env.ts";
import process from "node:process";
import mongoose from "mongoose";
import { initiator } from "./initiator.ts";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { registerSocketHandlers } from "./middlewares/socketIO/socket.middleware.ts";

(async () => {
  try {
    // Ensure services and controllers are initialized before routes load
    initiator.setupServices();
    initiator.setupControllers();

    const { app } = await import("./app.ts");
    const server = createServer(app);
    const io = new Server(server, {
      cors: { 
        origin: env.CORS_ORIGIN.split(","), 
        credentials: true 
      },
    });

    // Initialize WebSocketService with io
    initiator.webSocketService.init(io);
    
    // Register socket authentication and connection handlers
    registerSocketHandlers(io);

    await Database.getInstance();
    server.listen(env.PORT, () => console.log(`Server running on ${env.PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();

/* ---- PROCESS ERRORS ---- */
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await mongoose.connection.close();
  console.log("MongoDB disconnected due to SIGTERM");
  process.exit(0);
});
