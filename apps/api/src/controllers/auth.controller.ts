import type {NextFunction, Request, Response} from "express";
import type {AuthService} from "../services/auth.service.ts";
import {APIError} from "../utils/errors/api.errors.ts";
import type {insertUserZodSchema} from "../db/models/user.model.ts";
import {type LoginDTO} from "../dtos/login.dto.ts";
import type {ForgotPasswordDTO, ResetPasswordDTO, VerifyOTPDTO} from "../dtos/forgot-password.dto.ts";
import type {EmailVerificationDTO, ResendVerificationDTO} from "../dtos/email-verification.dto.ts";


export class AuthController {
    protected authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.verifyOTP = this.verifyOTP.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.resendEmailVerification = this.resendEmailVerification.bind(this);
        this.logout = this.logout.bind(this);
    }

    async register(req: Request<{}, {}, insertUserZodSchema>, res: Response, next: NextFunction) {
        try {
            const result = await this.authService.register(req.body);
            return res.status(201).json({
                success: true,
                message: result.message,
                userId: result.userId,
                email: result.email
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

    async forgotPassword(req: Request<{}, {}, ForgotPasswordDTO>, res: Response, next: NextFunction) {
        try {
            const result = await this.authService.forgotPassword(req.body);
            return res.status(200).json({
                success: true,
                message: result.message,
                expiresIn: result.expiresIn
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
        }
    }

    async verifyOTP(req: Request<{}, {}, VerifyOTPDTO>, res: Response, next: NextFunction) {
        try {
            const result = await this.authService.verifyOTP(req.body);
            return res.status(200).json({
                success: true,
                message: result.message,
                valid: result.valid,
                resetToken: result.resetToken,
                expiresIn: result.expiresIn
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
        }
    }

    async resetPassword(req: Request<{}, {}, ResetPasswordDTO>, res: Response, next: NextFunction) {
        try {
            const result = await this.authService.resetPassword(req.body);
            return res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
        }
    }

    async verifyEmail(req: Request<{}, {}, EmailVerificationDTO>, res: Response, next: NextFunction) {
        try {
            const result = await this.authService.verifyEmail(req.body);
            return res.status(200).json({
                success: true,
                message: result.message,
                verified: result.verified
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
        }
    }

    async resendEmailVerification(req: Request<{}, {}, ResendVerificationDTO>, res: Response, next: NextFunction) {
        try {
            const result = await this.authService.resendEmailVerification(req.body);
            return res.status(200).json({
                success: true,
                message: result.message,
                expiresIn: result.expiresIn
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
        }
    }
}
