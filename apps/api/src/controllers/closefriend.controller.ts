import type {CloseFriendService} from "../services/closefriend.service.ts";
import type {Request, Response, NextFunction} from "express";
import {APIError} from "../utils/errors/api.errors.ts";
import type {Authenticate} from "../middlewares/auth.middleware.ts";

export class CloseFriendController {
    private readonly closeFriendService: CloseFriendService;

    constructor(closeFriendService: CloseFriendService) {
        this.closeFriendService = closeFriendService;

        this.addToCloseFriend = this.addToCloseFriend.bind(this);
        this.removeFromCloseFriend = this.removeFromCloseFriend.bind(this);
        this.getCloseFriendList = this.getCloseFriendList.bind(this);
    }

    async addToCloseFriend(req: Authenticate, res: Response, next: NextFunction) {
        const userId = req.user.id;
        const friendId = req.body.friendId;

        try {
            await this.closeFriendService.addToCloseFriend(userId, friendId);
            return res.status(201).json({
                code: "FRIEND_ADDED_SUCCESS",
                message: "Friend added to close friends successfully."
            });
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof APIError) {
                return next(error);
            }
            return next(new APIError("INTERNAL_SERVER_ERROR", 500));
        }
    }
    
    async removeFromCloseFriend(req: Authenticate, res: Response, next: NextFunction) {
        const userId = req.user.id;
        const friendId = req.body.friendId;

        try {
            await this.closeFriendService.removeFromCloseFriend(userId, friendId);
            return res.status(200).json({
                code: "FRIEND_REMOVED_SUCCESS",
                message: "Friend removed from close friends successfully."
            });
        } catch (error: unknown) {
            if (error instanceof APIError) {
                return next(error);
            }
            return next(new APIError("INTERNAL_SERVER_ERROR", 500));
        }
    }

    async getCloseFriendList(req: Authenticate, res: Response, next: NextFunction) {
        const userId = req.user.id;

        try {
            const friends = await this.closeFriendService.getCloseFriendList(userId);
            return res.status(200).json({
                code: "GET_CLOSE_FRIENDS_SUCCESS",
                data: friends
            });
        } catch (error: unknown) {
            if (error instanceof APIError) {
                return next(error);
            }
            return next(new APIError("INTERNAL_SERVER_ERROR", 500));
        }
    }
}
