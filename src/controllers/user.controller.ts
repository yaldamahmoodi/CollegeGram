import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {NextFunction, Response} from "express";
import type {UserService} from "../services/user.service.ts";
import type {InsertPostDto} from "../db/models/post.model.ts";
import fs from "fs";
import { UnauthorizedError } from "../utils/errors/unauthorized.errors.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";
import {APIError} from "../utils/errors/api.errors.ts";

export class UserController {

    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
        this.uploadProfile = this.uploadProfile.bind(this);
        this.createPost = this.createPost.bind(this);
        this.getUserDetails = this.getUserDetails.bind(this);
        this.updateProfile = this.updateProfile.bind(this);

    }


    async uploadProfile(req: Authenticate, res: Response, next: NextFunction) {
        if (!req.user) return next(new UnauthorizedError("UNAUTHORIZED"))

        if (!req.file) return next(new ValidationError("INVALID_CREDENTIALS"))

        const filePath = req.file.path;

        try {
            const profile = await this.userService.uploadProfile(filePath, req.user.id);
            return res.status(201).json({
                success: true,
                message: "Profile upload success",
                data: profile
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }

    async getUserDetails(req: Authenticate, res: Response, next: NextFunction) {
        if (!req.user) return next(new UnauthorizedError("UNAUTHORIZED"))
        try {
            const userDetails = await this.userService.getUserDetails(req.user.id);
            const profilePhotoPath = userDetails.ProfilePhoto?.path;

            let profilePhotoBase64: string | null = null;

            if (profilePhotoPath && fs.existsSync(profilePhotoPath)) {
                const fileBuffer = fs.readFileSync(profilePhotoPath);
                profilePhotoBase64 = fileBuffer.toString("base64");
            }

            return res.status(200).json({
                success: true,
                data: {
                    username: userDetails.username,
                    email: userDetails.email,
                    profilePhotoUrl: profilePhotoBase64
                }
            })
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }

    async createPost(req: Authenticate, res: Response, next: NextFunction) {
        if (!req.user) return next(new UnauthorizedError("UNAUTHORIZED"))

        if (!req.file) return next(new ValidationError("INVALID_CREDENTIALS"))

        try {
            const files = req.files as Express.Multer.File[];
            const caption = req.body.caption;

            const filePaths: string[] = files.map(file => file.path);

            const postData: InsertPostDto = {
                user_id: req.user.id,
                urls: filePaths,
                caption: caption
            }

            await this.userService.createPost(postData)

            return res.status(201).json({
                success: true,
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

    getPosts = async (req: Authenticate, res: Response, next: NextFunction) => {
        try {
            const posts = await this.userService.getUserPosts(req.user.id);
            return res.status(200).json({success: true, data: posts})

        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }

    }

}
