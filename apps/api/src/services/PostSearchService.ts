import { ElasticClient } from "./elasticClient.service.ts";
import type { Post } from "../db/models/post.model.ts";

export class PostSearchService {
  private index = "posts";
  private readonly elasticClient: ElasticClient;

  constructor(elasticClient: ElasticClient) {
    this.elasticClient = elasticClient;
    this.searchPosts = this.searchPosts.bind(this);
  }

  async indexPost(post: Post) {
    await this.elasticClient.getClient().index({
      index: this.index,
      id: post._id.toString(),
      document: {
        user_id: post.user_id.toString(),
        urls: post.urls,
        caption: post.caption || "",
        photo_length: post.photo_length,
        like_count: post.like_count,
        save_count: post.save_count,
        mentions:
          post.mentions?.map((m) => ({
            user_id: m.user_id.toString(),
            username: m.username,
          })) || [],
        hashtag_array: post.hashtag_array || [],
      },
    });
  }



  async searchPosts(query: string, pageNumber: number) {
    try {

      const size = 10;
      const from = Math.max(0, (pageNumber - 1) * size);
      const q = (query ?? "").trim();

      const result = await this.elasticClient.getClient().search<Post>({
        index: this.index,
        from,
        size,
        track_total_hits: true,
        query:q? {
          bool: {
            should: [
              {
                multi_match: {
                  query: q,
                  fields: ["hashtag_array^2", "caption"],
                  fuzziness: "AUTO",
                  type: "most_fields"
                }
              },
              {
                wildcard: {
                  hashtag_array: { value: `*${q}*`, case_insensitive: true }
                }
              }
            ],
            minimum_should_match: 1
          }
        }:{match_all:{}},
        sort: [{ like_count: { order: "desc" } }]
      });

      const total =
        typeof (result.hits.total as any) === "number"
          ? (result.hits.total as unknown as number)
          : (result.hits.total as { value: number }).value;

      return {
        total,
        page: pageNumber,
        size,
        posts: result.hits.hits.map((hit) => ({
          id: hit._id,
          ...(hit._source as Post)
        }))
      };

    } catch (error) {
      throw error;
    }
  }

  async deletePost(id: string) {
    await this.elasticClient.getClient().delete({
      index: this.index,
      id,
    });
  }
}
