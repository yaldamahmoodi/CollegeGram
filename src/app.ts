import mongoose from "mongoose";
import app from "./server.ts";
import {connect_db} from "./db/connection.ts";
import env from "../env.ts";

(async () => {
    try {
        await connect_db();
        app.listen(env.PORT, () => console.log(`Server running on ${env.PORT}`));
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
})();