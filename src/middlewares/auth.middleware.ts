import type { Request, Response, NextFunction } from "express";
import {UserModel} from "../db/models/user.model.ts";
import jwt, {type JwtPayload} from "jsonwebtoken";

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
    
    const token = req.signedCookies.accessToken;
    
    if (!token) {
        return res.status(401)
        .json({ error: "Token not valid" });
    }

    const jwtSecret = process.env.ACCESS_TOKEN_SECRET as string;

    let payload: CustomJwtPayload;

    try {

        payload = jwt.verify(token, jwtSecret) as CustomJwtPayload;

    } catch (error: any) {

        return res.status(401)
        .json({ error: "Token expired or invalid" });

    } if (!payload._id) {
    return res.status(400).json({ error: "Token does not contain user ID" });
}


    const loggedInUser = await UserModel.findById(payload._id);
    
    if (!loggedInUser) {
        return res.status(404).json({error: "User not found"});
    }

    req.user = {
        id: payload._id, 
        username: payload.username,
    };

    next();
};
