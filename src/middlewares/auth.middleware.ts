import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import {JwtPayload} from "jsonwebtoken";
import {UserDocument, UserModel} from "../models/user.model";
import console from "node:console";

export interface Authenticate extends Request {
    user?: {
        id: string;
        username: string;
    }
}

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers['authorization'];
    if (!header) {
        return res.status(401).json({
            error: 'Unauthorized',
        })
    }
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({error: "Unauthorized"});
    }

    const token = header.replace('Bearer ', '');

    if (!token) {
        return res.status(400).json({
            error: 'Token not valid',
        })
    }
    const jwtSecret = process.env.ACCESS_TOKEN_SECRET as string;
    let payload: JwtPayload;
    try {
        payload = jwt.verify(token, jwtSecret) as JwtPayload;

    } catch (error: any) {
        return res.status(401).json({error: 'Token expired or invalid'});
    }

    const loggedInUser = await UserModel.findById(payload.userId) as UserDocument | null;

    if (!loggedInUser) {
        return res.status(404).json({error: "User not found"});

    }

    (req as Authenticate).user = {
        id: loggedInUser?._id.toString(),
        username: loggedInUser.username,
    };

    next();
};