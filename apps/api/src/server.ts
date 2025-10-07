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
    
    // Only exit if critical services (MongoDB, Redis, Email) are unhealthy
    const criticalServices = healthResult.services.filter(s => 
      s.name === 'MongoDB' || s.name === 'Redis' || s.name === 'Email Service'
    );
    const criticalUnhealthy = criticalServices.filter(s => s.status === 'unhealthy');
    
    if (criticalUnhealthy.length > 0) {
      console.error('❌ Cannot start API due to critical services being unhealthy:', criticalUnhealthy.map(s => s.name).join(', '));
      process.exit(1);
    }
    
    if (healthResult.overall === 'warning' || healthResult.overall === 'unhealthy') {
      console.log('⚠️  Starting API with some services unhealthy. Non-critical services may not work correctly.');
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
