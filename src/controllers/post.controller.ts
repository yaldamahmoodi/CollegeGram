import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {NextFunction, Response} from "express";
import type {PostService} from "../services/post.service.ts";
import {APIError} from "../utils/errors/api.errors.ts";

export class PostController {

    private readonly postService: PostService;

    constructor(postService: PostService) {
        this.postService = postService;
        this.getPost = this.getPost.bind(this);

    }


    async getPost(req: Authenticate, res: Response, next: NextFunction) {
        try {
            const post = await this.postService.getPost(req.body);
            return res.status(200).json({success: true, data: post})

        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }

}