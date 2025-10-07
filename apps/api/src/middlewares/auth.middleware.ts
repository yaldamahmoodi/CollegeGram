import type {NextFunction, Request, Response} from "express";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";
import { verifyAndLoadUser } from "./auth.util.ts";



export interface Authenticate<
    P = Request["params"],
    ResBody = any,
    ReqBody = any,
    ReqQuery = Request["query"]
> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user: {
        id: string;
        username?: string;
    };
}

export const authMiddleware = async (req: Authenticate, res: Response, next: NextFunction) => {
    try {
        const token = req.signedCookies.accessToken;
        if (!token) return next(new ValidationError("TOKEN_NOT_PROVIDED"));

        const { id, username } = await verifyAndLoadUser(token);
        req.user = { id, username };
        next();
    } catch (err: any) {
        if (err.message === "USER_NOT_FOUND") return next(new NotFoundError("NOT_FOUND"));
        next(new ValidationError("TOKEN_EXPIRED"));
    }
};
