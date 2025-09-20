import {FollowingModel} from "../db/models/following.model.ts"
import {UserModel} from "../db/models/user.model.ts";
import {AlreadyDoneError} from "../utils/errors/alreadyDone.errors.ts";
import {ElasticClient} from "../services/elasticClient.service.ts";
import {UserSearchService} from "../services/UserSearchService.ts";

const elasticClient = new ElasticClient();
const userSearchService = new UserSearchService(elasticClient);
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
                    {$inc: {following_count: +1}}
                );
                
                await UserModel.updateOne(
                    {_id: followedUserId}, 
                    {$inc: {follower_count: +1}}
                );
                
                const user = await UserModel.findById(userId).populate("ProfilePhoto");
                const followedUser = await UserModel.findById(followedUserId).populate("ProfilePhoto");
                if (user) await userSearchService.indexUser(user);
                if (followedUser) await userSearchService.indexUser(followedUser);

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
                    {$inc: {following_count: -1}}
                );
                
                await UserModel.updateOne(
                    {_id: followedUserId}, 
                    {$inc: {follower_count: -1}}
                );
                
                const user = await UserModel.findById(userId).populate("ProfilePhoto");
                const followedUser = await UserModel.findById(followedUserId).populate("ProfilePhoto");
                if (user) await userSearchService.indexUser(user);
                if (followedUser) await userSearchService.indexUser(followedUser);


            }
            if(dll.deletedCount == 0){
                throw new AlreadyDoneError('ALREADY_DONE','user unfollowed before')
            }
        return dll;
    }
}