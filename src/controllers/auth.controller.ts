import type {Request, Response} from "express";
import type {AuthService} from "../services/auth.service.ts";


export class AuthController {
    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService
    }

    async register(req: Request, res: Response) {
        try {
            await this.authService.register(req.body);
            return res.status(201).json({
                success: true,
                message: "User created successfully"
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const token = await this.authService.login(req.body);
            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                data: {
                    accessToken: token.accessToken,
                },
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
