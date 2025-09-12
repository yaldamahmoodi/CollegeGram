import {FollowingModel} from "../db/models/following.model.ts"
import {FollowerModel} from "../db/models/follower.model.ts";
import type {ClientSession} from "mongoose";
import mongoose from "mongoose";
import { ValidationError } from "../utils/errors/validation.errors.ts";
import { UserModel } from "../db/models/user.model.ts";

export class FollowUnfollowRepository {


    async followUser(userId: string, followedUserId: string) {

        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();

        try {
            await FollowingModel.create([{
                user_id: userId,
                following_id: followedUserId
            }], { session });

            await UserModel.updateOne(
                { _id: userId },
                { $inc: { following_count: 1 } },
                { session }
            );

            await FollowerModel.create([{
                user_id: followedUserId,
                follower_id: userId
            }], { session });

            await UserModel.updateOne(
                { _id: followedUserId },
                { $inc: { follower_count: 1 } },
                { session }
            );

            await session.commitTransaction();

        } catch (err: unknown) {
            await session.abortTransaction();
            throw new ValidationError("INTERNAL_SERVER_ERROR");       

        } finally {
            session.endSession();
        }
    }

    async unfollowUser(userId: string, followedUserId: string) {

        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();

        try {
            await FollowingModel.deleteOne([{
                user_id: userId,
                following_id: followedUserId
            }], { session });

            await UserModel.updateOne(
                { _id: userId },
                { $inc: { following_count: -1 } },
                { session }
            );

            await FollowerModel.deleteOne([{
                user_id: followedUserId,
                follower_id: userId
            }], { session });

            await UserModel.updateOne(
                { _id: followedUserId },
                { $inc: { follower_count: -1 } },
                { session }
            );

            await session.commitTransaction();

        } catch (err: unknown) {
            await session.abortTransaction();
            throw new ValidationError("INTERNAL_SERVER_ERROR");       

        } finally {
            session.endSession();
        }
        
    }





}