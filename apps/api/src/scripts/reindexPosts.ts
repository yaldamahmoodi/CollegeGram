import mongoose from "mongoose";
import {SearchIndexManager} from "../services/SearchIndexManager.service.ts";
import {ElasticClient} from "../services/elasticClient.service.ts";
import {postModel} from "../db/models/post.model.ts";
import {PostSearchService} from "../services/PostSearchService.ts";


async function reindexPosts() {
    const elasticClient = new ElasticClient();

    const indexManager = new SearchIndexManager(elasticClient);
    await indexManager.createPostsIndex();

    const postSearch = new PostSearchService(elasticClient);

    // -----------------------------
    // Reindex Posts
    // -----------------------------
    const batchSize = 500;
    let skip = 0;


    try {
        while (true) {
            const posts = await postModel.find()
                .skip(skip)
                .limit(batchSize)
            if (!posts.length) break;

            for (const post of posts) {
                
                try {
                    await postSearch.indexPost(post);
                } catch (err) {
                    console.error(`Failed to index post ${post._id}:`, err);
                }
                
            }

            skip += batchSize;
            console.log(`Indexed ${skip} posts`);
        }
        console.log("Reindexing posts complete.");

    } catch (err) {
        console.error("Reindexing posts failed:", err);
    }

}

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected.");

        await reindexPosts();

        await mongoose.connection.close();
        console.log("MongoDB connection closed. Reindex complete.");
        process.exit(0);
    } catch (err) {
        console.error("Reindex posts failed:", err);
        process.exit(1);
    }
})();
