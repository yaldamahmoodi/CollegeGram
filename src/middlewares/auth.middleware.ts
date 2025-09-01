import type {NextFunction, Request, Response} from "express";
import {UserModel} from "../db/models/user.model.ts";
import jwt, {type JwtPayload} from "jsonwebtoken";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";


interface CustomJwtPayload extends JwtPayload {
    id: string;
    username: string;
}

export interface Authenticate extends Request {
    user?: {
        id: string;
        username: string;
    }
}

export const authMiddleware = async (req: Authenticate, res: Response, next: NextFunction) => {
    try {
        const token = req.signedCookies.accessToken;
        if (!token) {
            next(new ValidationError("TOKEN_NOT_PROVIDED"))
        }
        const jwtSecret = process.env.ACCESS_TOKEN_SECRET as string;
        let payload: CustomJwtPayload;
        payload = jwt.verify(token, jwtSecret) as CustomJwtPayload;
        if (!payload._id) {
            next(new ValidationError("TOKEN_NOT_PROVIDED"))
        }
        const loggedInUser = await UserModel.findById(payload._id);

        if (!loggedInUser) {
            next(new NotFoundError("NOT_FOUND"))
        }
        req.user = {
            id: payload._id,
            username: payload.username,
        };
        next();
    } catch (error: any) {
        next(new ValidationError("TOKEN_EXPIRED"))
    }
};
