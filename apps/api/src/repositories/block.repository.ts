import mongoose from "mongoose";
import {Block} from "../db/models/block.model.ts";

export class BlockRepository{
  async block (userId: string , blockedId: string){
    return await Block.updateOne(
      {user_id: userId , blocked_id: blockedId},
      {$setOnInsert: {user_id: userId , blocked_id: blockedId, createdAt: new Date()}},
      {upsert: true}
    )
  }

  async unblock (userId: string , blockedId: string){
    return await Block.deleteMany({
            user_id:userId,
            blocked_id: blockedId
        })
  }

  async blockedBefore(userId:string , blockedId: string){
    return await Block.findOne({ user_id: userId, blocked_id: blockedId }).exec()
    }

  async getblocks(user_id: string) {
      return Block.aggregate([
            {
                $match: {
                    blocked_id: new mongoose.Types.ObjectId(user_id),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "blockedDetails",
                },
            },
            { $unwind: "$blockedDetails" },
            {
                $lookup: {
                    from: "profilephotos",
                    localField: "blockedDetails._id",
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
                    userId: "$blockedDetails._id",
                    username: "$blockedDetails.username",
                    firstname: "$blockedDetails.firstname",
                    lastname: "$blockedDetails.lastname",
                    follower_count: "$blockedDetails.follower_count",
                    following_count: "$blockedDetails.following_count",
                    profilePhoto: {
                        $ifNull: ["$profilePhoto.path", null],
                    },
                },
            },
        ]);
    }
}