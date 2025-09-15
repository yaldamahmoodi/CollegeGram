import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {NextFunction, Response, Request} from "express";
import type {PostService} from "../services/post.service.ts";
import {APIError} from "../utils/errors/api.errors.ts";
import {asyncHandler} from "../utils/asyncHandler.utils.ts";
import {type userParamSchema, UserParamsSchema} from "../utils/types.ts";

export class PostController {

    private readonly postService: PostService;

    constructor(postService: PostService) {
        this.postService = postService;
        this.getPost = this.getPost.bind(this);
        this.getPosts = this.getPosts.bind(this);
        this.savePost = this.savePost.bind(this);
        this.unsavePost = this.unsavePost.bind(this);
    }

    async getPost(req: Authenticate, res: Response) {
        const post = await this.postService.getPost(req.params['post_id']);

        const output = {
            _id: post._id,
            user_id: post.user_id,
            urls: post.urls,
            caption: post.caption,
            like_count: post.like_count,
            save_count: post.save_count,
            mentions: post.mentions,
            hashtag_array: post.hashtag_array,
            photo_length: post.photo_length,
        }
        return res.status(200).json({
            code: 'GET_POST_SUCCESSFULLY',
            data: output
        });
    }

    async getPosts(req: Authenticate<{}, {}, {}, userParamSchema>, res: Response, next: NextFunction) {

        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;

        let userId = req.query.id;
        if (!userId) {
            userId = req.user.id;
        }

        try {
            const posts = await this.postService.getPosts(userId, page, pageSize);

            const output = posts.data.map(post => ({
                _id: post._id,
                user_id: post.user_id,
                urls: post.urls,
                caption: post.caption,
                like_count: post.like_count,
                save_count: post.save_count,
                mentions: post.mentions,
                hashtag_array: post.hashtag_array,
                photo_length: post.photo_length,
            }));

            return res.status(200).json({
                code: 'GET_POST_SUCCESSFULLY',
                totalCount: posts.totalCount,
                data: output,
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
        }

    }

    async savePost(req: Authenticate, res: Response, next: NextFunction) {
        try {
             await this.postService.savePost(req.user.id, req.body.postId);

            return res.status(200).json({
                code: "SAVED_SUCCESSFULLY",
                message: `Post ${req.body.postId} saved successfully.`,
            });
        } catch (error) {
            if (error instanceof APIError) return next(error);
            return res.status(500).json({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong while saving the post."
            });
        }
    }


    async unsavePost(req: Authenticate, res: Response, next: NextFunction) {
        try {
             await this.postService.unsavePost(req.user.id, req.body.postId);

            return res.status(200).json({
                code: "UNSAVED_SUCCESSFULLY",
                message: `Post ${req.body.postId} unsaved successfully.`,
            });
        } catch (error) {
            if (error instanceof APIError) return next(error);

            return res.status(500).json({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong while unsaving the post."
            });
        }
    }


    likePost = asyncHandler(async (req: Authenticate<string>, res: Response) => {
        await this.postService.likePost(req.user.id, req.body.postId)
        return res.status(200).json({
            code: "LIKED_SUCCESSFULY",
            message: `post ${req.body.postId} liked successfully.`
        })

    })

    unLikePost = asyncHandler(async (req: Authenticate, res: Response) => {
        await this.postService.unLikePost(req.user.id, req.params['post_id'])
        return res.status(200).json({
            code: "UNLIKED_SUCCESSFULY",
            message: `post ${req.params['post_id']}unliked successfully.`
        })
    })

    explore = asyncHandler(async (req: Authenticate, res: Response) => {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const userId: string = req.user.id;


    })


}