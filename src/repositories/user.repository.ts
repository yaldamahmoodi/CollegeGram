import {type IUser, UserModel, type updateProfileUserSchema} from "../db/models/user.model.ts";
import {type Post, postModel} from "../db/models/post.model.ts";
import {FollowingModel} from "../db/models/following.model.ts"
import {FollowerModel} from "../db/models/follower.model.ts";
import type {ClientSession} from "mongoose";
import mongoose from "mongoose";
import { ValidationError } from "../utils/errors/validation.errors.ts";

export class UserRepository {

    async findByUserId(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId);
    }

    async findUserDetails(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId)
            .populate("ProfilePhoto", "path");
    }

    async updateUser(username: string, userData: updateProfileUserSchema) {
        return await UserModel.updateOne(
            {username},
            {$set: userData},
        ).exec();
    }
    // This is Amir's code
    // The query related to the posts model must be in the corresponding repository
    async findUserPosts(userId: string): Promise<Post[]> {
        return postModel.find({user_id: userId}, {urls: {$slice: 1}, photo_length: 1});
    }


    
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