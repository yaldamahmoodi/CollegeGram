import {FollowingModel} from "../db/models/following.model.ts"
import {FollowerModel} from "../db/models/follower.model.ts";
import type {ClientSession} from "mongoose";
import mongoose from "mongoose";
import {ValidationError} from "../utils/errors/validation.errors.ts";
import {UserModel} from "../db/models/user.model.ts";

export class FollowUnfollowRepository {


    async followUser(userId: string, followedUserId: string) {
        try {
            const fll =
                await FollowingModel.updateOne(
                    {user_id: userId, following_id: followedUserId},
                    {$setOnInsert: {user_id: userId, following_id: followedUserId, createdAt: new Date()}},
                    {upsert: true}
                )
            if (fll.upsertedCount > 0) {
                await UserModel.updateOne(
                    {_id: userId},
                    {$inc: {following_count: 1}},
                );
            }
        } catch (err: unknown) {
            throw new ValidationError("INTERNAL_SERVER_ERROR");
        }
    }

    async unfollowUser(userId: string, followedUserId: string) {
        try {
            const dll = await FollowingModel.deleteOne({
                user_id: userId,
                following_id: followedUserId
            });
            if (dll.deletedCount > 0) {

            await UserModel.updateOne(
                {_id: userId},
                {$inc: {following_count: -1}},
            );
            }
        } catch (err: unknown) {
            throw new ValidationError("INTERNAL_SERVER_ERROR");
        }
    }
}