import {Follow} from "../db/models/follow.model.ts";
import {UserModel} from "../db/models/user.model.ts";
import {AlreadyDoneError} from "../utils/errors/alreadyDone.errors.ts";

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
        console.log(userId, 'userId');
        console.log(followedUserId, 'followedUserId');
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


    async getFollowers(userId: string) {
        return Follow.find({following_id: userId})
            .populate("follower_id", "username avatar")
            .exec();
    }


    async getFollowings(userId: string) {
        return Follow.find({follower_id: userId})
            .populate("following_id", "username avatar")
            .exec();
    }
}
