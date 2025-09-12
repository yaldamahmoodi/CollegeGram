import {type ISave, SaveModel} from "../db/models/save.model.ts";


export class SaveRepository {

    async savePost(postId: string, userId: string): Promise<ISave | null> {
        const save = new SaveModel({
            post_id: postId,
            user_id: userId
        });
        return save.save();
    }

    async unsavePost(userId: string, postId: string): Promise<ISave | null> {
        return SaveModel.findOneAndDelete({
            post_id: postId,
            user_id: userId
        })
    }

    async findSave(postId: string, userId: string): Promise<ISave | null> {
        return SaveModel.findOne({post_id: postId, user_id: userId});
    }

    async getSavesListByUserId(userId: string, page: number, pageSize: number) {
        const saved = await SaveModel.aggregate([
            {$match: {user_id: userId}},
            {
                $lookup: {
                    from: "Posts",
                    localField: "post_id",
                    foreignField: "_id",
                    as: "post"
                }
            },
            {$unwind: {path: "$post", preserveNullAndEmptyArrays: true}},
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