import type {NextFunction, Response, Request} from "express";
import type {UserSearchService} from "../services/UserSearchService.ts";
import { APIError } from "../utils/errors/api.errors.ts";
import type { Authenticate } from "../middlewares/auth.middleware.ts";


export class SearchController {

  private readonly userSearchService: UserSearchService;

  constructor(userSearchService: UserSearchService) {
    this.userSearchService = userSearchService;
    this.userSearch = this.userSearch.bind(this);
    
  }

  async userSearch(req: Authenticate, res: Response, next: NextFunction) {
    
    try {
      const page = Number(req.params["page_number"]) || 1;
      const query = req.params["query"] as string;

      const users = query
        ? await this.userSearchService.searchUsers(query, page)
        : await this.userSearchService.getAllUsers(page);

      res.json(users);
    } catch (error: unknown) {
      if (error instanceof APIError) return next(error);
      next(error);
    }

  }


}
