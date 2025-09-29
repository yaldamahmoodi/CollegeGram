import mongoose from "mongoose";
import { postModel } from "../db/models/post.model.ts";

async function createMentionIndex() {
    try {
        await postModel.collection.createIndex(
            { 
                "mentions.user_id": 1, 
                "createdAt": -1 
            },
            {
                name: "mentions_user_id_createdAt",
                background: true 
            }
        );
        await postModel.collection.createIndex(
            { "mentions.user_id": 1 },
            {
                name: "mentions_user_id",
                background: true
            }
        );
    } catch (error) {
        throw error;
    }
}
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
    mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/your-db")
        .then(() => {
            console.log("Connected to MongoDB");
            return createMentionIndex();
        })
        .then(() => {
            console.log("Index creation completed successfully!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Script failed:", error);
            process.exit(1);
        });
}

export { createMentionIndex };
