import {FollowingModel} from "../db/models/following.model.ts"
import {UserModel} from "../db/models/user.model.ts";
import {AlreadyDoneError} from "../utils/errors/alreadyDone.errors.ts";

export class FollowUnfollowRepository {


    async followUser(userId: string, followedUserId: string) {

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
            if(fll.upsertedCount == 0){
                throw new AlreadyDoneError('ALREADY_DONE','user followed before')
            }
       return fll;
    }

    async unfollowUser(userId: string, followedUserId: string) {

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
            if(dll.deletedCount == 0){
                throw new AlreadyDoneError('ALREADY_DONE','user unfollowed before')
            }
        return dll;
    }
}