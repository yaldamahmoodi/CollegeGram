import {Follow} from "../db/models/follow.model.ts";
import {UserModel} from "../db/models/user.model.ts";
import {AlreadyDoneError} from "../utils/errors/alreadyDone.errors.ts";
import mongoose from "mongoose";

export class FollowRepository {

    async followUser(userId: string, followedUserId: string) {

        const fll = await Follow.updateOne(
            {follower_id: userId, following_id: followedUserId},
            {$setOnInsert: {follower_id: userId, following_id: followedUserId, createdAt: new Date()}},
            {upsert: true}
        );

        if (fll.upsertedCount > 0) {
            await UserModel.updateOne(
                {_id: userId},
                {$inc: {following_count: 1}}
            );
            await UserModel.updateOne(
                {_id: followedUserId},
                {$inc: {follower_count: 1}}
            );
        }

        if (fll.upsertedCount === 0) {
            throw new AlreadyDoneError("ALREADY_DONE", "user followed before");
        }

        return fll;
    }

    async unfollowUser(userId: string, followedUserId: string) {
        const dll = await Follow.deleteOne({
            follower_id: userId,
            following_id: followedUserId
        });
        if (dll.deletedCount > 0) {
            await UserModel.updateOne(
                {_id: userId},
                {$inc: {following_count: -1}}
            );
            await UserModel.updateOne(
                {_id: followedUserId},
                {$inc: {follower_count: -1}}
            );
        }

        if (dll.deletedCount === 0) {
            throw new AlreadyDoneError("ALREADY_DONE", "user unfollowed before");
        }

        return dll;
    }

    async getFollowers(user_id: string) {
        return Follow.aggregate([
            {
                $match: {
                    following_id: new mongoose.Types.ObjectId(user_id),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "follower_id",
                    foreignField: "_id",
                    as: "followerDetails",
                },
            },
            { $unwind: "$followerDetails" },
            {
                $lookup: {
                    from: "profilephotos",
                    localField: "followerDetails._id",
                    foreignField: "user_id",
                    as: "profilePhoto",
                },
            },
            {
                $unwind: {
                    path: "$profilePhoto",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    userId: "$followerDetails._id",
                    username: "$followerDetails.username",
                    firstname: "$followerDetails.firstname",
                    lastname: "$followerDetails.lastname",
                    follower_count: "$followerDetails.follower_count",
                    following_count: "$followerDetails.following_count",
                    profilePhoto: {
                        $ifNull: ["$profilePhoto.path", null],
                    },
                },
            },
        ]);
    }

    async getFollowings(user_id: string) {
        return Follow.aggregate([
            {
                $match: {
                    follower_id: new mongoose.Types.ObjectId(user_id),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "following_id",
                    foreignField: "_id",
                    as: "followingDetails",
                },
            },
            { $unwind: "$followingDetails" },
            {
                $lookup: {
                    from: "profilephotos",
                    localField: "followingDetails._id",
                    foreignField: "user_id",
                    as: "profilePhoto",
                },
            },
            {
                $unwind: {
                    path: "$profilePhoto",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    userId: "$followingDetails._id",
                    username: "$followingDetails.username",
                    firstname: "$followingDetails.firstname",
                    lastname: "$followingDetails.lastname",
                    follower_count: "$followingDetails.follower_count",
                    following_count: "$followingDetails.following_count",
                    profilePhoto: {
                        $ifNull: ["$profilePhoto.path", null],
                    },
                },
            },
        ]);
    }




    async isFollowed(followerId: string, followingId: string): Promise<boolean> {
        const exists = await Follow.exists({
            follower_id: followerId,
            following_id: followingId,
        });
        return Boolean(exists);
    }

}
