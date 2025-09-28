import type {NextFunction, Request, Response} from "express";
import type {AuthService} from "../services/auth.service.ts";
import {APIError} from "../utils/errors/api.errors.ts";
import type {insertUserZodSchema} from "../db/models/user.model.ts";
import {type LoginDTO} from "../dtos/login.dto.ts";


export class AuthController {
    protected authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async register(req: Request<{}, {}, insertUserZodSchema>, res: Response, next: NextFunction) {
        try {
            await this.authService.register(req.body);
            return res.status(201).json({
                code: "USER_REGISTERED",
                message: "User created successfully"
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }

    async login(req: Request<{}, {}, LoginDTO>, res: Response, next: NextFunction) {
        try {
            const {accessToken, userId} = await this.authService.login(req.body.username, req.body.password);
            return res.status(200).cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                signed: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }).json({
                success: true,
                message: "User logged in successfully",
                accessToken: accessToken,
                userId: userId,
            });

        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.authService.logout();
            
            // Clear the accessToken cookie
            return res.status(200).clearCookie('accessToken', {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                signed: true,
            }).json({
                code: "LOGOUT_SUCCESSFUL",
                message: result.message
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error)
        }
    }
}
