import app from "./server.ts";
import {Database} from "./db/connection.ts";
import env from "../env.ts";
import process from "node:process";
import mongoose from "mongoose";

(async () => {
    try {
        await Database.getInstance();
        app.listen(env.PORT, () => console.log(`Server running on ${env.PORT}`));
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
