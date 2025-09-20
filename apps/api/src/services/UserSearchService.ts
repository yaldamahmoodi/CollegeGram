import {ElasticClient} from "./elasticClient.service.ts";
import type {IUser} from "../db/models/user.model.ts";

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
      document:  {
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
    const from = (pageNumber -1) * 10
    const size = 10;

    const result = await this.elasticClient.getClient().search<UserSource>({
      index: this.index,
      from,
      size,
      query: {
        multi_match: {
          query,
          fields: ["username^3", "firstname^2", "lastname^2"],
          fuzziness: "AUTO",
        },
      },
      sort: [{ createdAt: { order: "desc" } }],// sort: [{ createdAt: { order: "asc" } }]
    });

    const total = typeof result.hits.total === "number" 
    ? result.hits.total : result.hits.total.value;

    return {
      total,
      page: pageNumber,
      size,
      users: result.hits.hits.map((hit) => ({
        id: hit._id,
        ...hit._source,
      })),
    }; 
    
  }
  
async getAllUsers(pageNumber: number) {
  const from = (pageNumber - 1) * 10;
  const size = 10;

  const result = await this.elasticClient.getClient().search<UserSource>({
    index: this.index,
    from,
    size,
    sort: [{ createdAt: { order: "desc" } }],
    query: { match_all: {} },
  });

    const total = typeof result.hits.total === "number" 
    ? result.hits.total : result.hits.total.value;


  return {
      total,
      page: pageNumber,
      size,
      users: result.hits.hits.map((hit) => ({
        id: hit._id,
        ...hit._source,
      }))
    } 
}





  async deleteUser(id: string) {
    await this.elasticClient.getClient().delete({
      index: this.index,
      id,
    });
  }
}