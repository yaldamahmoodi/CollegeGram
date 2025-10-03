import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {NextFunction, Response} from "express";
import type {PostService} from "../services/post.service.ts";
import {APIError} from "../utils/errors/api.errors.ts";
import {asyncHandler} from "../utils/asyncHandler.utils.ts";
import {type userParamSchema} from "../utils/types.ts";
import type {exploreSchema} from "../dtos/posts.dto.ts";
import {UnauthorizedError} from "../utils/errors/unauthorized.errors.ts";
import type {InsertCommentDto} from "../db/models/comment.model.ts";
import {Types} from "mongoose";
import {BadRequestErrors} from "../utils/errors/badRequest.errors.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";
import type {CommentService} from "../services/comment.service.ts";

export class PostController {

    private readonly postService: PostService;
    private readonly commentService: CommentService;

    constructor(postService: PostService, commentService: CommentService) {
        this.postService = postService;
        this.commentService = commentService;

        this.getPost = this.getPost.bind(this);
        this.getPosts = this.getPosts.bind(this);
        this.savePost = this.savePost.bind(this);
        this.unsavePost = this.unsavePost.bind(this);
        this.addComment = this.addComment.bind(this);
        this.getComments = this.getComments.bind(this);
        this.likeComment = this.likeComment.bind(this)
        this.unlikeComment = this.unlikeComment.bind(this)
        this.getMentionedPosts = this.getMentionedPosts.bind(this)
    }

    async getPost(req: Authenticate, res: Response) {
        const post = await this.postService.getPost(req.params.post_id, req.user.id);

        const output = {
            _id: post._id,
            user_id: post.user_id,
            user: post.user,
            urls: post.urls.map(file => `${req.protocol}://${req.get("host")}/uploads/posts/${file}`),
            caption: post.caption,
            like_count: post.like_count,
            save_count: post.save_count,
            mentions: post.mentions,
            hashtag_array: post.hashtag_array,
            photo_length: post.photo_length,
            isLiked: post.isLiked || false,
            isSaved: post.isSaved || false,
            createdAt: post.createdAt
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
                urls: post.urls.map(file => `${req.protocol}://${req.get("host")}/uploads/posts/${file}`),
                caption: post.caption,
                like_count: post.like_count,
                save_count: post.save_count,
                mentions: post.mentions,
                hashtag_array: post.hashtag_array,
                photo_length: post.photo_length,
                isLiked: post.isLiked || false,
                isSaved: post.isSaved || false,
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

    explore = asyncHandler(async (req: Authenticate<{}, {}, {}, exploreSchema>, res: Response) => {

        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const userId: string = req.user.id;

        const output = await this.postService.explore(userId, page, pageSize)
        return res.status(200).json({
            code: "EXPLORE_SUCCESSFULY",
            data: output
        })


    })

    async addComment(req: Authenticate<{}, {}, InsertCommentDto>, res: Response, next: NextFunction) {
        try {
            if (!req.user) return next(new UnauthorizedError("UNAUTHORIZED"))

            const {post_id, content, parent_comment} = req.body;
            if (!post_id || !Types.ObjectId.isValid(post_id))
                return next(new ValidationError("INVALID_POST_ID"));

            if (!content)
                return next(new BadRequestErrors('CONTENT_REQUIRED'));

            if (parent_comment && !Types.ObjectId.isValid(parent_comment))
                return next(new BadRequestErrors('INVALID_COMMENT_ID'));

            const comment = await this.commentService.addComment(req.user.id, req.body);

            return res.status(201).json({
                code: "COMMENT_ADDED_SUCCESSFULLY",
                data: comment,
            });

        } catch (error) {
            if (error instanceof APIError) return next(error);
        }
    }

    async getComments(req: Authenticate, res: Response, next: NextFunction) {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const postId = req.query.postId as string;
        try {
            if (!req.user) return next(new UnauthorizedError("UNAUTHORIZED"))

            const comments = await this.commentService.getCommentsByPost(postId, page, pageSize)
            return res.status(200).json({
                code: "GET_COMMENTS_SUCCESSFULLY",
                data: comments,
            })
        } catch (error) {
            if (error instanceof APIError) return next(error);
        }
    }

    async likeComment(req: Authenticate, res: Response, next: NextFunction) {
        try {
            await this.commentService.commentLike(req.user.id, req.body.commentId)
            return res.status(200).json({
                code: "LIKED_SUCCESSFULY",
                message: `comment ${req.body.commentId} liked successfully.`
            })
        } catch (error) {
            if (error instanceof APIError) return next(error);
        }
    }

    async unlikeComment(req: Authenticate, res: Response, next: NextFunction) {
        try {
            await this.commentService.commentUnLike(req.user.id, req.body.commentId)
            return res.status(200).json({
                code: "UNLIKED_SUCCESSFULY",
                message: `comment ${req.body.commentId} unliked successfully.`
            })
        } catch (error) {
            if (error instanceof APIError) return next(error);
        }
    }

    getMentionedPosts = asyncHandler(async (req: Authenticate, res: Response) => {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const userId = req.user.id;
        
        const mentionedPosts = await this.postService.getMentionedPosts(userId, page, pageSize);
        const output = mentionedPosts.data.map(post => ({
            ...post,
            urls: post.urls.map((file: string) => `${req.protocol}://${req.get("host")}/uploads/posts/${file}`)
        }));
        
        return res.status(200).json({
            code: "GET_MENTIONED_POSTS_SUCCESSFULLY",
            totalCount: mentionedPosts.totalCount,
            data: output
        });
    });
}