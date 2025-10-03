import type {NextFunction, Response, Request} from "express";
import type {UserSearchService} from "../services/UserSearchService.ts";
import { APIError } from "../utils/errors/api.errors.ts";
import type { Authenticate } from "../middlewares/auth.middleware.ts";
import type {PostSearchService} from "../services/PostSearchService.ts";


export class SearchController {

  private readonly userSearchService: UserSearchService;
  private readonly postSearchService: PostSearchService;

  constructor(userSearchService: UserSearchService, postSearchService: PostSearchService) {
    this.userSearchService = userSearchService;
    this.postSearchService = postSearchService;
    this.userSearch = this.userSearch.bind(this);
    this.postSearch = this.postSearch.bind(this);

  }

  async userSearch(req: Authenticate, res: Response, next: NextFunction) {
    
    try {
      const page = Number(req.params["page_number"]) || 1;
      const query = req.params["query"] as string;
      const userId = req.user?.id;

      const users = await this.userSearchService.searchUsers(query, page, userId);

      res.json(users);
    } catch (error: unknown) {
      if (error instanceof APIError) return next(error);
      next(error);
    }

  }

  async postSearch(req: Authenticate, res: Response, next: NextFunction) {
      
    try {
      const page = Number(req.params["page_number"]) || 1;
      const query = req.params["query"] as string;
      const userId = req.user?.id;
      const posts = await this.postSearchService.searchPosts(query, page, userId)
      posts.posts = posts.posts.map((post) => ({
        ...post,
        urls: post.urls.map((url) => `${req.protocol}://${req.get("host")}/uploads/posts/${url}`),
      }))

      return res.json(posts);

    } catch (error: unknown) {
      if (error instanceof APIError) return next(error);
      next(error);
    }

  }
  

}
