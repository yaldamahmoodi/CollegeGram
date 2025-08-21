import {Request, Response, Router} from "express";
import {UserService} from "../services/user.service";
import {registerDto} from "../dtos/register.dto";
import {loginDTO} from "../dtos/login.dto";
import * as console from "node:console";

export class UserController {

    constructor(protected userService: UserService) {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
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
            console.error(error);
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
            const { accessToken, refreshToken } = await this.userService.login(userData);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                data: { accessToken },
            });

        } catch (error: any) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies["refreshToken"];
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "No refresh token provided",
                });
            }

            const newAccessToken = await this.userService.refreshToken(refreshToken);

            return res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data: { accessToken: newAccessToken },
            });
        } catch (error: any) {
            console.error(error);
            return res.status(403).json({
                success: false,
                message: error.message || "Could not refresh token",
            });
        }
    }
}
