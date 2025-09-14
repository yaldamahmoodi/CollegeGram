import {type InsertPostDto, type Post, postModel} from "../db/models/post.model.ts";
import {LikeModel} from "../db/models/like.model.ts";
import mongoose from "mongoose";
import {InternalErrors} from "../utils/errors/internal.errors.ts";
import {UserModel, type IUser} from "../db/models/user.model.ts";
import {AlreadyDoneError} from "../utils/errors/alreadyDone.errors.ts";

export class PostRepository {

    async findUserPosts(userId: string, page: number, pageSize: number) {
        const totalCount = await postModel.countDocuments({user_id: userId});
        const data = await postModel
            .find({user_id: userId})
            .sort({createdAt: -1})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();

        return {
            totalCount,
            data
        };
    }


    async findUserDetails(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId)
            .populate("ProfilePhoto", "path");
    }

    async createPost(postData: InsertPostDto) {
        const post = new postModel({
            user_id: postData.user_id,
            urls: postData.urls,
            caption: postData.caption,
            mentions: postData.mentions,
            hashtag_array: postData.hashtag_array,
        });
        return await post.save();
    }

    async getPostById(postId: string): Promise<Post | null> {
        return postModel.findById(postId).exec();
    }

    async updatePostSaveCount(postId: string, count: number) {
        return postModel.findOneAndUpdate(
            {_id: postId},
            {$inc: {save_count: count}},
            {new: true}
        )
    }

    async likePost(userId: string, postId: string) {

        const like = await LikeModel.updateOne(
            {post_id: postId, user_id: userId},
            {$setOnInsert: {post_id: postId, user_id: userId, createdAt: new Date()}},
            {upsert: true}
        );

        if (like.upsertedCount > 0) {
            await postModel.updateOne(
                {_id: postId},
                {$inc: {like_count: 1}},
            );
        }

        if (like.upsertedCount == 0) {
            throw new AlreadyDoneError('ALREADY_DONE', 'post liked before')
        }

        return like;
    }

    async unLikePost(userId: string, postId: string) {

        const result = await LikeModel.deleteOne(
            {post_id: postId, user_id: userId},
        );
        if (result.deletedCount > 0) {
            await postModel.updateOne(
                {_id: postId},
                {$inc: {like_count: -1}}
            );
        }
        if (result.deletedCount == 0) {
            throw new AlreadyDoneError('ALREADY_DONE', 'post unliked before')
        }

        return result;
    }

}