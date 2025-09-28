import {CloseFriendModel, type ICloseFriend} from "../db/models/closeFriend.model.ts";
import {Types} from "mongoose";

export class CloseFriendRepository {

    async addToCloseFriend(userId: string, friendId: string): Promise<ICloseFriend> {
        const closeFriend = new CloseFriendModel({
            user_id: new Types.ObjectId(userId),
            friend_id: new Types.ObjectId(friendId),
        });
        return await closeFriend.save();
    }

    async removeFromCloseFriend(userId: string, friendId: string): Promise<{ deletedCount?: number }> {
        return await CloseFriendModel.deleteOne({
            user_id: new Types.ObjectId(userId),
            friend_id: new Types.ObjectId(friendId),
        });
    }

}