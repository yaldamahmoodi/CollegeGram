import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {NextFunction, Response, Request} from "express";
import type {PostService} from "../services/post.service.ts";
import {APIError} from "../utils/errors/api.errors.ts";
import type {savePostDTO} from "../db/models/save.model.ts";
import {asyncHandler} from "../utils/asyncHandler.utils.ts";


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

    async savePost(req: Authenticate & Request<{}, {}, savePostDTO>, res: Response, next: NextFunction) {
        try {
            const savePostDetails = await this.postService.savePost(req.body.user_id, req.body.post_id)

            return res.status(200).json({success: true, data: savePostDetails})

        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }

    async unsavePost(req: Authenticate & Request<{}, {}, savePostDTO>, res: Response, next: NextFunction) {

    }

    likePost = asyncHandler(async (req: Authenticate<string>, res: Response) => {
        await this.postService.likePost(req.user.id, req.params['post_id'])
        return res.status(200).json({
            "code": "LIKED_SUCCESSFULY",
            "message": `post ${req.params['post_id']}liked successfully.`, data: []
        })

    })

    unLikePost = asyncHandler(async (req: Authenticate<string>, res: Response) => {
        await this.postService.unLikePost(req.user.id, req.params['post_id'])
        return res.status(200).json({
            "code": "UNLIKED_SUCCESSFULY",
            "message": `post ${req.params['post_id']}unliked successfully.`, data: []
        })
    })

}