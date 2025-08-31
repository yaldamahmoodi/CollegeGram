import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {Response} from "express";
import type {UserService} from "../services/user.service.ts";
import type {InsertPostDto} from "../db/models/post.model.ts";
import fs from "fs";
import {APIError} from "../middlewares/error.middleware.ts";

export class UserController {

    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
        this.uploadProfile = this.uploadProfile.bind(this);
        this.createPost = this.createPost.bind(this);
        this.getUserDetails = this.getUserDetails.bind(this);
        this.profileUpdater = this.profileUpdater.bind(this);

    }


    async uploadProfile(req: Authenticate, res: Response) {
        if (!req.user) return res.status(401).json({error: "Unauthorized"});

        if (!req.file) return res.status(400).json({error: "No file uploaded"});

        const filePath = req.file.path;

        try {
            const profile = await this.userService.uploadProfile(filePath, req.user.id);
            return res.status(201).json({
                success: true,
                message: "Profile upload success",
                data: profile
            });
        } catch (error: any) {
            return res.status(400).json({success: false, message: error.message});
        }
    }

    async getUserDetails(req: Authenticate, res: Response) {
        if (!req.user) return res.status(401).json({error: "Unauthorized"});

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
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async createPost(req: Authenticate, res: Response) {
        if (!req.user) return res.status(401).json({error: "Unauthorized"});

        if (!req.files) return res.status(400).json({error: "No file uploaded"});

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
        } catch (error: any) {
            return res.status(400).json({success: false, message: error.message});
        }
    }

    async profileUpdater(req: Authenticate, res: Response) {

        try {
            await this.userService.profileUpdater(req.user.username,req.body);
            return res.status(201).json({
                success: true,
                message: "User successfully Updated"
            });

        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

    }

    getPosts = async (req: Authenticate, res: Response) => {
        try {
            const posts = await this.userService.getUserPosts(req.user.id);
            return res.status(200).json({success: true, data: posts})
        } catch (error) {
            if (error instanceof APIError) {
                console.log(error, "getPosts Controller")
                res.status(500).json({error: error.message});
            }
        }
    }

}
