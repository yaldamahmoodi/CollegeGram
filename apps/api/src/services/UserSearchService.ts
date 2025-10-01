import { ElasticClient } from "./elasticClient.service.ts";
import type { IUser } from "../db/models/user.model.ts";

type UserSource = {
  username: string;
  firstname?: string;
  lastname?: string;
  follower_count: number;
  profilePhotoPath: string | null;
  createdAt: string;
};

export class UserSearchService {
  private index = "users";
  private readonly elasticClient: ElasticClient;

  constructor(elasticClient: ElasticClient) {
    this.elasticClient = elasticClient;
  }

  async indexUser(user: IUser) {
    await this.elasticClient.getClient().index({
      index: this.index,
      id: user._id.toString(),
      document: {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        follower_count: user.follower_count,
        profilePhotoPath: user.ProfilePhoto?.path || null,
        createdAt: user.createdAt.toISOString(),
      },
    });
  }

  async searchUsers(query: string, pageNumber: number) {

    try {
      const size = 10;
      const from = Math.max(0, (pageNumber - 1) * size);
      const q = (query ?? "").trim();

      const result = await this.elasticClient.getClient().search<UserSource>({
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
                  fields: ["username^2", "firstname", "lastname"],
                  fuzziness: "AUTO",
                  type: "most_fields",
                },
              },
              {
                wildcard: {
                  username: { value: `*${q}*`, case_insensitive: true },
                },
              },
               {
                wildcard: {
                  firstname: { value: `*${q}*`, case_insensitive: true },
                },
              }, 
              {
                wildcard: {
                  lastname: { value: `*${q}*`, case_insensitive: true },
                },
              },
            ],
            minimum_should_match: 1,
          },
        }:{match_all:{}},
      sort: [{ createdAt: { order: "desc" } }],// sort: [{ createdAt: { order: "asc" } }]
      });
      const total =
        typeof (result.hits.total as any) === "number"
          ? (result.hits.total as unknown as number)
          : (result.hits.total as { value: number }).value;

      return {
        total,
        page: pageNumber,
        size,
        users: result.hits.hits.map((hit) => ({
          id: hit._id,
          ...hit._source,
        })),
      };
    } catch (error) {
      throw error;
    }
  }


  async deleteUser(id: string) {
    await this.elasticClient.getClient().delete({
      index: this.index,
      id,
    });
  }
}
