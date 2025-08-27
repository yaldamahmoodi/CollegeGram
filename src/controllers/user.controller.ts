import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {Response} from "express";
import console from "node:console";
import type {UserService} from "../services/user.service.ts";
import fs from "fs";

export class UserController {

    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
        this.uploadProfile = this.uploadProfile.bind(this);
        this.getUserDetails = this.getUserDetails.bind(this);
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
            console.error(error);
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

}
