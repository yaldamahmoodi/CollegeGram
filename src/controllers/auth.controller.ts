import type {Request, Response} from "express";
import {authService} from "../services/auth.service.ts";
import {registerDto} from "../dtos/register.dto.ts";
import {loginDTO} from "../dtos/login.dto.ts";

export class authController {

    private readonly userService: authService;

    constructor(authService: authService) {
        this.userService = authService;
    }

    async register(req: Request, res: Response) {
        const result = registerDto.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                errors: 'input not valid'
            });
        }

        const userData = result.data;

        try {
            const newUser = await this.userService.register(userData);
            return res.status(201).json({
                success: true,
                message: "User created successfully",
                user: {username: newUser.username, email: newUser.email},
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async login(req: Request, res: Response) {
        const result = loginDTO.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                errors: 'input not valid'
            });
        }

        const userData = result.data;

        try {
            const loginUser = await this.userService.login(userData);
            res.cookie('sessionId', loginUser.sessionId, {
                httpOnly: true,
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            res.cookie('refreshToken', loginUser.refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                data: {
                    accessToken: loginUser.accessToken,
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
