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



    async createPostsIndex() {
        const client = this.elasticClient.getClient();
        const exists = await client.indices.exists({index: "posts"});
        if (exists) return;

        await client.indices.create({
            index: "posts",
            mappings: {
                properties: {
                    user_id: { type: "keyword" },
                    urls: { type: "keyword" }, 
                    caption: { type: "text" },
                    photo_length: { type: "integer" },
                    like_count: { type: "integer" },
                    save_count: { type: "integer" },
                    mentions: {
                        properties: {
                            user_id: { type: "keyword" },
                            username: { type: "text", fields: { raw: { type: "keyword" } } }
                        }
                    },
                    hashtag_array: { type: "keyword" }, 
                },

            },
        });
    }


}
