import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {NextFunction, Response, Request} from "express";
import type {UserService} from "../services/user.service.ts";
import {UnauthorizedError} from "../utils/errors/unauthorized.errors.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";
import {APIError} from "../utils/errors/api.errors.ts";
import {type userParamSchema} from "../utils/types.ts";
import {extractHashtags} from "../helpers/hashtag.extractor.ts";
import type {PostService} from "../services/post.service.ts";
import type {InsertPostDto} from "../db/models/post.model.ts";
import type {updateProfileUserSchema} from "../db/models/user.model.ts";


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
        this.followUser = this.followUser.bind(this);
        this.unfollowUser = this.unfollowUser.bind(this);
        this.getUserSavesList = this.getUserSavesList.bind(this);
        this.unfollowUser = this.unfollowUser.bind(this);
        this.getFollowingsList = this.getFollowingsList.bind(this);
        this.getFollowersList = this.getFollowersList.bind(this);

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
                    firstname: userDetails.firstname,
                    lastname: userDetails.lastname,
                    biography: userDetails.biography,
                    follower_count: userDetails.follower_count,
                    following_count: userDetails.following_count,
                    post_count: userDetails.post_count,
                    profilePhotoUrl: profilePhotoPath,
                }
            })
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }


    async createPost(req: Authenticate<{}, {}, InsertPostDto>, res: Response, next: NextFunction) {
        if (!req.user) return next(new UnauthorizedError("UNAUTHORIZED"))

        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            return next(new ValidationError("NO_FILES_UPLOADED"));
        }
        try {

            const files = req.files as Express.Multer.File[];
            const caption = req.body.caption;
            const filePaths: string[] = files.map(file => file.path);
            const mentions = Array.isArray(req.body.mentions) ? req.body.mentions : [];
            const hashtag_array: string[] = caption ? extractHashtags(caption) : [];

            const postData: InsertPostDto = {
                user_id: req.user.id,
                urls: filePaths,
                caption,
                mentions,
                hashtag_array
            }

            await this.postService.createPost(postData)

            return res.status(201).json({
                code: "POST_CREATED_SUCCESS",
                message: "Post success",
            })
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }

    async updateProfile(req: Authenticate<{}, {}, updateProfileUserSchema>, res: Response, next: NextFunction) {

        try {
            const updatedUser = await this.userService.updateProfile(req.user.id, req.body);
            return res.status(200).json({
                code: "USER_UPDATED_SUCCESS",
                message: "User successfully Updated",
                data: {
                    userId: req.user.id,
                    username: updatedUser.username,
                    firstname: updatedUser.firstname,
                    lastname: updatedUser.lastname,
                    email: updatedUser.email,
                    biography: updatedUser.biography
                }
            });

        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }

    }


    async followUser(req: Authenticate, res: Response, next: NextFunction) {

        const {followedUserId} = req.body;

        if (followedUserId === req.user.id) return next(new ValidationError("YOU_CANNOT_FOLLOW_YOURSELF"))

        try {

            await this.userService.followUser(req.user.id, followedUserId);
            return res.status(200).json({
                code: "USER_FOLLOWED",
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
            return res.status(200).json({
                code: "USER_UNFOLLOWED",
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

            const transformedData = savedPosts.data.map(item => {
                return {
                    _id: item._id,
                    postOwner: item.postOwner.username,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    firstUrl: item.post.urls[0] || null,
                    like_count: item.post.like_count,
                    save_count: item.post.save_count,
                    mentions: item.post.mentions,
                    hashtag_array: item.post.hashtag_array,
                    photo_length: item.post.photo_length,
                };
            });
            return res.status(200).json({
                code: "GET_SAVED_POSTS_SUCCESS",
                totalCount: savedPosts.metadata.totalCount,
                savedPosts: transformedData,
            })
        } catch (error) {
            if (error instanceof APIError) return next(error)
        }
    }

    async getFollowersList(req: Authenticate<{}, {}>, res: Response, next: NextFunction) {
        try {
            const followerUserList = await this.userService.getFollowers(req.user.id)
            return res.status(200).json({
                code: "success",
                data: followerUserList
            })
        } catch (error) {
            if (error instanceof APIError) return next(error)
        }
    }

    async getFollowingsList(req: Authenticate<{}, {}>, res: Response, next: NextFunction) {
        try {
            const followingUserList = await this.userService.getFollowings(req.user.id)
            return res.status(200).json({
                code: "sucess",
                data: followingUserList
            })
        } catch (error) {
            if (error instanceof APIError) return next(error)
        }
    }

}
