import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {NextFunction, Response, Request} from "express";
import type {UserService} from "../services/user.service.ts";
import type {InsertPostDto} from "../db/models/post.model.ts";
import {UnauthorizedError} from "../utils/errors/unauthorized.errors.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";
import {APIError} from "../utils/errors/api.errors.ts";
import {type userParamSchema} from "../utils/types.ts";
import {extractHashtags} from "../helpers/hashtag.extractor.ts";
import type {PostService} from "../services/post.service.js";


export class UserController {

    private readonly userService: UserService;
    private readonly postService: PostService;


    constructor(userService: UserService, postService: PostService) {
        this.userService = userService;
        this.postService = postService;

        this.uploadProfile = this.uploadProfile.bind(this);
        this.createPost = this.createPost.bind(this);
        this.getUserDetails = this.getUserDetails.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.getPosts = this.getPosts.bind(this);
    }


    async uploadProfile(req: Authenticate, res: Response, next: NextFunction) {
        if (!req.user) return next(new UnauthorizedError("UNAUTHORIZED"))

        if (!req.file) return next(new ValidationError("INVALID_CREDENTIALS"))

        const filePath = req.file.path;

        try {
            const profile = await this.userService.uploadProfile(filePath, req.user.id);
            return res.status(201).json({
                code: "UPLOADED",
                message: "Profile upload success",
                data: profile
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }

    async getUserDetails(req: Authenticate & Request<{}, {}, {}, userParamSchema>, res: Response, next: NextFunction) {

        let userId = req.query.id;
        if (!userId) {
            userId = req.user.id;
        }

        try {
            const userDetails = await this.userService.getUserDetails(userId);
            const profilePhotoPath = userDetails.ProfilePhoto?.path;

            return res.status(200).json({
                code: "GET_USER_SUCCESSFULLY",
                data: {
                    username: userDetails.username,
                    email: userDetails.email,
                    biography: userDetails.biography,
                    follower_count: userDetails.follower_count,
                    following_count: userDetails.following_count,
                    post_count: userDetails.post_count,
                    profilePhotoUrl: profilePhotoPath
                }
            })
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
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

            // inja chera tuye body baraye sakhtan post like_count o save_count mikhay?
            const like_count = Number(req.body.like_count) || 0;
            const save_count = Number(req.body.save_count) || 0;
            const mentions = req.body.mentions
            const hashtag_array: string[] = extractHashtags(req.body.caption);
            const postData: InsertPostDto = {
                user_id: req.user.id,
                urls: filePaths,
                caption,
                like_count,
                save_count,
                mentions,
                hashtag_array
            }

            await this.userService.createPost(postData)

            return res.status(201).json({
                coed: "POST_CREATED_SUCCESS",
                message: "Post success",
            })
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }

    async updateProfile(req: Authenticate, res: Response, next: NextFunction) {

        try {
            await this.userService.updateProfile(req.user.username, req.body);
            return res.status(201).json({
                success: true,
                message: "User successfully Updated"
            });

        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }

    }

    async getPosts(req: Authenticate, res: Response, next: NextFunction) {
        try {
            const posts = await this.userService.getUserPosts(req.user.id);
            return res.status(200).json({
                code: 'GET_POST_SUCCESSFULLY',
                data: posts
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
        }
    }

    async followUser(req: Authenticate, res: Response, next: NextFunction) {

        const {followedUserId} = req.body;

        if (followedUserId === req.user.id) return next(new ValidationError("YOU_CANNOT_FOLLOW_YOURSELF"))

        try {

            await this.userService.followUser(req.user.id, followedUserId);
            return res.status(201).json({
                success: true,
                message: "User successfully Followed"
            });

        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }

    async unfollowUser(req: Authenticate, res: Response, next: NextFunction) {

        const {unfollowedUserId} = req.body;

        if (unfollowedUserId === req.user.id) return next(new ValidationError("YOU_CANNOT_UNFOLLOW_YOURSELF"))

        try {

            await this.userService.unfollowUser(req.user.id, unfollowedUserId);
            return res.status(201).json({
                success: true,
                message: "User successfully Unfollowed"
            });

        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }

    }

    async getUserSavesList(req: Authenticate, res: Response, next: NextFunction) {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const userId: string = req.user.id;

        try {
            const savedPosts = await this.postService.getSavePosts(userId, page, pageSize);

            return res.status(200).json({
                code: "SUCCESS",
                data: savedPosts,
            })
        } catch (error) {
            if (error instanceof APIError) return next(error)
        }
    }
}
