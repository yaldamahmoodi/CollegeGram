import mongoose from "mongoose";
import {SearchIndexManager} from "../services/SearchIndexManager.service.ts";
import {ElasticClient} from "../services/elasticClient.service.ts";
import {UserModel} from "../db/models/user.model.ts";
import {UserSearchService} from "../services/UserSearchService.ts";
import { BlockRepository } from "../repositories/block.repository.ts";


async function reindexUsers() {
    const elasticClient = new ElasticClient();
    const blockRepository = new BlockRepository();
    // Ensure user index exists
    const indexManager = new SearchIndexManager(elasticClient);
    await indexManager.createUsersIndex();

    const userSearch = new UserSearchService(elasticClient, blockRepository);

    // -----------------------------
    // Reindex Users
    // -----------------------------
    const batchSize = 500;
    let skip = 0;


    try {
        while (true) {
        const users = await UserModel.find()
            .populate("ProfilePhoto", "path")
            .skip(skip)
            .limit(batchSize)
            .lean();

        if (!users.length) break;

        for (const user of users) {
            
            try {
                await userSearch.indexUser(user);
            } catch (err) {
                console.error(`Failed to index user ${user._id}:`, err);
            }
            
        }

        skip += batchSize;
        console.log(`Indexed ${skip} users`);
        }
        console.log("Reindexing complete.");
    } catch (err) {
        console.error("Reindexing failed:", err);
    }

}

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
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
