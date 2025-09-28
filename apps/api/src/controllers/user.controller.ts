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
        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.followUser = this.followUser.bind(this);
        this.unfollowUser = this.unfollowUser.bind(this);
        this.getUserSavesList = this.getUserSavesList.bind(this);
        this.unfollowUser = this.unfollowUser.bind(this);
        this.getFollowingsList = this.getFollowingsList.bind(this);
        this.getFollowersList = this.getFollowersList.bind(this);
        this.getOtherProfile = this.getOtherProfile.bind(this);
        this.acceptFollowRequest = this.acceptFollowRequest.bind(this);
        this.rejectFollowRequest = this.rejectFollowRequest.bind(this);

    }


    async uploadProfile(req: Authenticate, res: Response, next: NextFunction) {
        if (!req.user) return next(new UnauthorizedError("UNAUTHORIZED"))

        if (!req.file) return next(new ValidationError("INVALID_CREDENTIALS"))

        const filename = req.file.filename;

        try {
            await this.userService.uploadProfile(filename, req.user.id);
            return res.status(201).json({
                code: "UPLOADED",
                message: "Profile upload success",
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
        }
    }

    async getProfile(req: Authenticate & Request<{}, {}, {}, userParamSchema>, res: Response, next: NextFunction) {

        try {
            const userDetails = await this.userService.getProfile(req.user.id);
            const profilePhotoUrl = userDetails.ProfilePhoto?.path
                ? `${req.protocol}://${req.get("host")}/uploads/profiles/${userDetails.ProfilePhoto.path}`
                : null;
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
                    profilePhotoUrl,
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
            const filePaths: string[] = files.map(file => file.filename);
            
            // Parse mentions from JSON string if it exists
            let mentions = [];
            if (req.body.mentions) {
                try {
                    mentions = typeof req.body.mentions === 'string' 
                        ? JSON.parse(req.body.mentions) 
                        : req.body.mentions;
                } catch (error) {
                    mentions = [];
                }
            }
            
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
                    biography: updatedUser.biography,
                    isPrivate: updatedUser.isPrivate,
                }
            });

        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }

    }


    async followUser(req: Authenticate, res: Response, next: NextFunction) {

        const {followerUserId} = req.body;
        console.log(followerUserId)

        if (followerUserId === req.user.id) return next(new ValidationError("YOU_CANNOT_FOLLOW_YOURSELF"))

        try {

            await this.userService.followUser(req.user.id, followerUserId);
            return res.status(200).json({
                code: "USER_FOLLOWED",
                message: "User successfully Followed"
            });

        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }

    async unfollowUser(req: Authenticate, res: Response, next: NextFunction) {

        const {followerUserId} = req.body;

        if (followerUserId === req.user.id) return next(new ValidationError("YOU_CANNOT_UNFOLLOW_YOURSELF"))

        try {

            await this.userService.unfollowUser(req.user.id, followerUserId);
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
                code: "SUCCESS",
                data: followerUserList
            })
        } catch (error) {
            if (error instanceof APIError) return next(error)
        }
    }

    async getFollowingsList(req: Authenticate, res: Response, next: NextFunction) {
        try {
            const followingUserList = await this.userService.getFollowings(req.user.id)
            return res.status(200).json({
                code: "SUCCESS",
                data: followingUserList
            })
        } catch (error) {
            if (error instanceof APIError) return next(error)
        }
    }

    async getOtherProfile(req: Authenticate & Request<{ username: string }>, res: Response, next: NextFunction) {
        try {
            const username = req.params.username;
            const loggedInUserId = req.user.id;

            const userDetails = await this.userService.getOtherProfile(
                loggedInUserId,
                username
            );


        
            const profilePhotoUrl = userDetails.ProfilePhoto?.path
                ? `${req.protocol}://${req.get("host")}/uploads/profiles/${userDetails.ProfilePhoto.path}`
                : null;


            return res.status(200).json({
                code: "GET_USER_PROFILE_SUCCESSFULLY",
                data: {
                    userId: userDetails._id.toString(),
                    username: userDetails.username,
                    email: userDetails.email,
                    firstname: userDetails.firstname || null,
                    lastname: userDetails.lastname || null,
                    biography: userDetails.biography || null,
                    follower_count: userDetails.follower_count ?? 0,
                    following_count: userDetails.following_count ?? 0,
                    post_count: userDetails.post_count ?? 0,
                    profilePhotoUrl: profilePhotoUrl || null,
                    followStatus: userDetails.followStatus.status,
                    isBlocked: userDetails.isBlocked ?? false,
                    hasBlocked: userDetails.hasBlocked ?? false,
                    isCloseFriend: userDetails.isCloseFriend ?? false,
                },
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
            return next(error);
        }
    }

    async acceptFollowRequest(req: Authenticate, res: Response, next: NextFunction) {
        const { followerUserId } = req.body;

        if (followerUserId === req.user.id) return next(new ValidationError("YOU_CANNOT_ACCEPT_YOURSELF"))

        try {
            await this.userService.acceptFollowRequest(req.user.id, followerUserId);
            return res.status(200).json({
                code: "FOLLOW_REQUEST_ACCEPTED",
                message: "Follow request successfully accepted"
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
        }
    }

    async rejectFollowRequest(req: Authenticate, res: Response, next: NextFunction) {
        const { followerUserId } = req.body;

        if (followerUserId === req.user.id) return next(new ValidationError("YOU_CANNOT_REJECT_YOURSELF"))

        try {
            await this.userService.rejectFollowRequest(req.user.id, followerUserId);
            return res.status(200).json({
                code: "FOLLOW_REQUEST_REJECTED",
                message: "Follow request successfully rejected"
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
        }
    }

}
