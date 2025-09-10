import {type Post, postModel} from "../db/models/post.model.ts";

export class PostRepository {

    async createPost(userId: string, urls: string[], caption?: string, mentions?: object[]) {
        const post = new postModel({
            user_id: userId,
            urls,
            caption,
            mentions
        });
        return await post.save();
    }

    async getPostById(postId: string): Promise<Post | null> {
    return postModel.findById(postId).exec();
    }
}