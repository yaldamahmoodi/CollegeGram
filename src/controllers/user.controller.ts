import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {NextFunction, Response, Request} from "express";
import type {UserService} from "../services/user.service.ts";
import {UnauthorizedError} from "../utils/errors/unauthorized.errors.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";
import {APIError} from "../utils/errors/api.errors.ts";
import {type userParamSchema} from "../utils/types.ts";


export class UserController {

    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
        this.uploadProfile = this.uploadProfile.bind(this);
        this.getUserDetails = this.getUserDetails.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.followUser = this.followUser.bind(this);
        this.unfollowUser = this.unfollowUser.bind(this);

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

    async getUserDetails(req: Authenticate & Request<{},{},{},userParamSchema>, res: Response, next: NextFunction) {
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
}
