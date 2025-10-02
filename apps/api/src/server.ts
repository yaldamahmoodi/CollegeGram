import { Database } from "./db/connection.ts";
import env from "../env.ts";
import process from "node:process";
import mongoose from "mongoose";
import { initiator } from "./initiator.ts";
import RedisService from "./services/redis.service.ts";
import VerificationService from "./services/verification.service.ts";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { registerSocketHandlers } from "./middlewares/socketIO/socket.middleware.ts";
import { HealthCheckerService } from "./routes/health.route.ts";

(async () => {
  try {
    
    const healthChecker = HealthCheckerService.getInstance();
    const healthResult = await healthChecker.checkAllServices();
    
    if (healthResult.overall === 'unhealthy') {
      console.error('❌ Cannot start API due to unhealthy services. Please fix the issues above.');
      process.exit(1);
    }
    
    if (healthResult.overall === 'warning') {
      console.log('⚠️  Starting API with warnings. Some features may not work correctly.');
    }

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

    initiator.webSocketService.init(io);
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
    const redisService = await RedisService.getInstance();
    await redisService.disconnect();
  console.log("MongoDB and Redis connections closed due to app termination");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await mongoose.connection.close();
    const redisService = await RedisService.getInstance();
    await redisService.disconnect();
  console.log("MongoDB and Redis disconnected due to SIGTERM");
  process.exit(0);
});
