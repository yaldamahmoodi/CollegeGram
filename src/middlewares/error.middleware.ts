import mongoose from "mongoose";

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