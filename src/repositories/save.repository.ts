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
}