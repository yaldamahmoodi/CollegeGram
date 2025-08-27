import {postModel} from "../db/models/post.model.ts";

export class PostRepository {

    async createPost(userId: string, urls: string[], caption?: string) {
        const post = new postModel({
            user_id: userId,
            urls,
            caption,
        });
        return await post.save();
    }
}