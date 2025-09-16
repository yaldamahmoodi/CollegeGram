// src/services/SearchIndexManager.ts
import type { ElasticClient } from "./elasticClient.service.ts"

export class SearchIndexManager {
    private es: ElasticClient;
    constructor( es: ElasticClient){
    }

    async createUsersIndex() {
        const client = this.es.getClient();
        const exists = await client.indices.exists({index: "users"});
        if (exists) return;

        await client.indices.create({
            index: "users",
            mappings: {
                properties: {
                    email: { type: "keyword" },        // unique, exact match searches
                    username: { type: "text", fields: { raw: { type: "keyword" } } },
                    firstname: { type: "text", fields: { raw: { type: "keyword" } } },
                    lastname: { type: "text", fields: { raw: { type: "keyword" } } },
                    biography: { type: "text" },
                    follower_count: { type: "integer" },
                    following_count: { type: "integer" },
                    post_count: { type: "integer" },
                    createdAt: { type: "date" },
                    updatedAt: { type: "date" },
                },

            },
        });
    }
}
