import type {NextFunction, Request, Response} from "express";
import type {AuthService} from "../services/auth.service.ts";
import {APIError} from "../utils/errors/api.errors.ts";


export class AuthController {
    protected authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            await this.authService.register(req.body);
            return res.status(201).json({
                success: true,
                message: "User created successfully"
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = await this.authService.login(req.body);
            return res.status(200).cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                signed: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }).json({
                success: true,
                message: "User logged in successfully",
            });

        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }
}
