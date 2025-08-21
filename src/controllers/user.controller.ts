import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {Response} from "express";
import {UserService} from "../services/user.service.ts";
import console from "node:console";


export class UserController {
    constructor(protected userService: UserService) {
        this.uploadProfile = this.uploadProfile.bind(this);

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


}
