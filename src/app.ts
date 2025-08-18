import mongoose from "mongoose";
import app from "./server.ts";
import {connect_db} from "./db/connection.ts";


const PORT = process.env.PORT || 3001;

(async () => {
    try {
        await connect_db();
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
})();