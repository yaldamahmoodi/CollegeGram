import {type ISave, SaveModel} from "../db/models/save.model.ts";
import mongoose from "mongoose";


export class SaveRepository {

    async findSave(postId: string, userId: string): Promise<ISave | null> {
        return SaveModel.findOne({post_id: postId, user_id: userId});
    }

    async savePost(postId: string, userId: string) {
        return SaveModel.updateOne(
            {post_id: postId, user_id: userId},
            {$setOnInsert: {post_id: postId, user_id: userId, createdAt: new Date()}},
            {upsert: true}
        )
    }

    async unsavePost(userId: string, postId: string): Promise<ISave | null> {
        return SaveModel.findOneAndDelete({
            post_id: postId,
            user_id: userId
        })
    }

    async getSavesListByUserId(userId: string, page: number, pageSize: number) {
        const saved = await SaveModel.aggregate([
            {$match: {user_id: new mongoose.Types.ObjectId(userId)}},
            // First lookup: join posts
            {
                $lookup: {
                    from: "posts",
                    localField: "post_id",
                    foreignField: "_id",
                    as: "post"
                }
            },
            {$unwind: {path: "$post", preserveNullAndEmptyArrays: true}},
            // Second lookup: join the owner of the post
            {
                $lookup: {
                    from: "users",
                    let: { ownerId: "$post.user_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$ownerId"] } } },
                        { $project: { username: 1 } }
                    ],
                    as: "postOwner"
                }
            },
            { $unwind: { path: "$postOwner", preserveNullAndEmptyArrays: true } },

            {$sort: {createdAt: -1}},

            {
                $facet: {
                    metaData: [{$count: 'totalCount'}],
                    data: [{$skip: (page - 1) * pageSize}, {$limit: pageSize}]
                }
            }
        ]);

        const totalCount = saved[0].metaData[0]?.totalCount || 0;

        return {
            metadata: {totalCount, page, pageSize},
            data: saved[0].data
        };
    }

}