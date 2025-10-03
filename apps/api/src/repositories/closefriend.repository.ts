import {CloseFriendModel, type ICloseFriend} from "../db/models/closeFriend.model.ts";
import {Types} from "mongoose";

export class CloseFriendRepository {

    async addToCloseFriend(userId: string, friendId: string) {
        return CloseFriendModel.updateOne(
            {
                user_id: new Types.ObjectId(userId),
                friend_id: new Types.ObjectId(friendId),
            },
            {
                $setOnInsert: {
                    user_id: new Types.ObjectId(userId),
                    friend_id: new Types.ObjectId(friendId),
                    createdAt: new Date(),
                },
            },
            {upsert: true}
        );
    }

    async removeFromCloseFriend(userId: string, friendId: string): Promise<{ deletedCount?: number }> {
        return CloseFriendModel.deleteOne({
            user_id: new Types.ObjectId(userId),
            friend_id: new Types.ObjectId(friendId),
        });
    }

    async getCloseFriendList(userId: string) {
        return CloseFriendModel.aggregate([
            {
                $match: {
                    user_id: new Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "friend_id",
                    foreignField: "_id",
                    as: "friend_info"
                }
            },
            {
                $unwind: "$friend_info"
            },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "friend_info._id": 1,
                    "friend_info.username": 1,
                    "friend_info.email": 1,
                    "friend_info.follower_count": 1,
                    "friend_info.following_count": 1,
                    "friend_info.post_count": 1,
                    "friend_info.firstname": 1,
                    "friend_info.lastname": 1,
                    "friend_info.profilePhoto": {
                        $ifNull: ["$friend_info.ProfilePhoto.path", null]
                    }
                }
            }
        ]);
    }

    async isCloseFriend(userId: string, friendId: string): Promise<ICloseFriend | null> {
        return CloseFriendModel.findOne({
            user_id: new Types.ObjectId(userId),
            friend_id: new Types.ObjectId(friendId),
        }).exec();
    }

}