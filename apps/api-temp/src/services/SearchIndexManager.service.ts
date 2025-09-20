import type { ElasticClient } from "./elasticClient.service.ts"

export class SearchIndexManager {
    private elasticClient: ElasticClient;

    constructor( elasticClient: ElasticClient){
        this.elasticClient = elasticClient;
    }

    async createUsersIndex() {
        const client = this.elasticClient.getClient();
        const exists = await client.indices.exists({index: "users"});
        if (exists) return;

        await client.indices.create({
            index: "users",
            mappings: {
                properties: {
                    username: { type: "text", fields: { raw: { type: "keyword" } } },
                    firstname: { type: "text", fields: { raw: { type: "keyword" } } },
                    lastname: { type: "text", fields: { raw: { type: "keyword" } } },
                    profilePhotoPath: { type: "keyword" },
                    follower_count: { type: "integer" },
                    createdAt: { type: "date" },
                },

            },
        });
    }
}
