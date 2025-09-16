
import mongoose from "mongoose";
import {SearchIndexManager} from "../services/SearchIndexManager.service.ts";
import {ElasticClient} from "../services/elasticClient.service.ts";


async function reindexUsers() {
    const es = new ElasticClient();
    // Ensure user index exists
    const indexManager = new SearchIndexManager(es);
    await indexManager.createUsersIndex();

    // -----------------------------
    // Reindex Users
    // -----------------------------
    const batchSize = 500;
    let skip = 0;

}

(async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/yourdb"); // update with your DB URL
        console.log("MongoDB connected.");

        await reindexUsers();

        await mongoose.connection.close();
        console.log("MongoDB connection closed. Reindex complete.");
        process.exit(0);
    } catch (err) {
        console.error("Reindex failed:", err);
        process.exit(1);
    }
})();
