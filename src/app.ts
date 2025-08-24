import mongoose from "mongoose";
import app from "./server.ts";
import {connect_db, Database} from "./db/connection.ts";
import env from "../env.ts";

(async () => {
    try {
        await Database.getInstance();
        app.listen(env.PORT, () => console.log(`Server running on ${env.PORT}`));
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
})();