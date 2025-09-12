import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {NextFunction, Response, Request} from "express";
import type {PostService} from "../services/post.service.ts";
import {APIError} from "../utils/errors/api.errors.ts";
import {asyncHandler} from "../utils/asyncHandler.utils.ts";
import type {InsertPostDto} from "../db/models/post.model.ts";
import {extractHashtags} from "../helpers/hashtag.extractor.ts";
import {UnauthorizedError} from "../utils/errors/unauthorized.errors.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";

export class PostController {

    private readonly postService: PostService;

    constructor(postService: PostService) {
        this.postService = postService;
        this.getPost = this.getPost.bind(this);
        this.createPost = this.createPost.bind(this);

    }

    async createPost(req: Authenticate, res: Response, next: NextFunction) {
        if (!req.user) return next(new UnauthorizedError("UNAUTHORIZED"))

        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            return next(new ValidationError("NO_FILES_UPLOADED"));
        }
        try {

            const files = req.files as Express.Multer.File[];
            const caption = req.body.caption;
            const filePaths: string[] = files.map(file => file.path);
            const mentions = Array.isArray(req.body.mentions) ? req.body.mentions : [];
            const hashtag_array: string[] = extractHashtags(req.body.caption);
            const postData: InsertPostDto = {
                user_id: req.user.id,
                urls: filePaths,
                caption,
                mentions,
                hashtag_array
            }

            await this.postService.createPost(postData)

            return res.status(201).json({
                coed: "POST_CREATED_SUCCESS",
                message: "Post success",
            })
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }
    

    getPost = asyncHandler(async (req: Authenticate<string>, res: Response) => {

            const post = await this.postService.getPost(req.params['post_id']);
            return res.status(200).json({code: 'GET_POST_SUCCESSFULLY', data: post})

    });

    getPosts = asyncHandler(async (req: Authenticate<string>, res: Response) => {

            const posts = await this.postService.getPosts(req.user.id);
            return res.status(200).json({code: 'GET_POST_SUCCESSFULLY', data: posts});
 
    });  

    savePost = asyncHandler(async (req: Authenticate<string>, res: Response) => {
        const savePostDetails = await this.postService.savePost(req.user.id, req.params['post_id']);

        return res.status(200).json({
            code: "SAVED_SUCCESSFULLY",
            message: `Post ${req.params['post_id']} saved successfully.`,
            data: savePostDetails
        });
    });

    unsavePost = asyncHandler(async (req: Authenticate<string>, res: Response) => {
        const unsavePostDetails = await this.postService.unsavePost(req.user.id, req.params['post_id']);

        return res.status(200).json({
            code: "UNSAVED_SUCCESSFULLY",
            message: `Post ${req.params['post_id']} unsaved successfully.`,
            data: unsavePostDetails
        });
    });

    likePost = asyncHandler(async (req: Authenticate<string>, res: Response) => {
        await this.postService.likePost(req.user.id, req.params['post_id'])
        return res.status(200).json({
            code: "LIKED_SUCCESSFULY",
            message: `post ${req.params['post_id']}liked successfully.`, data: []
        })

    })

    unLikePost = asyncHandler(async (req: Authenticate<string>, res: Response) => {
        await this.postService.unLikePost(req.user.id, req.params['post_id'])
        return res.status(200).json({
            code: "UNLIKED_SUCCESSFULY",
            message: `post ${req.params['post_id']}unliked successfully.`, data: []
        })
    })


}