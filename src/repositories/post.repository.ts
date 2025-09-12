import {type InsertPostDto, type Post, postModel} from "../db/models/post.model.ts";
import {LikeModel} from "../db/models/like.model.ts";
import mongoose from "mongoose";
import {InternalErrors} from "../utils/errors/internal.errors.ts";
import { UserModel, type IUser } from "../db/models/user.model.ts";

export class PostRepository {



    // This is Amir's code
    // The query related to the posts model must be in the corresponding repository
    async findUserPosts(userId: string): Promise<Post[]> {
        return postModel.find({user_id: userId}, {urls: {$slice: 1}, photo_length: 1});
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

    async updatePostSaveCount(postId: string ,count: number) {
        return await postModel.findOneAndUpdate(
            {post_id: postId},
            {$inc: {count: count}}
        )
    }

    async likePost(userId: string, postId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const like = await LikeModel.updateOne(
                {post_id: postId, user_id: userId},
                {$setOnInsert: {post_id: postId, user_id: userId, createdAt: new Date()}},
                {upsert: true, session}
            );

            if (like.upsertedCount > 0) {
                await postModel.updateOne(
                    {_id: postId},
                    {$inc: {likeCount: 1}},
                    {session}
                );
            }

            await session.commitTransaction();
            await session.endSession();
        } catch (err) {
            await session.abortTransaction();
            await session.endSession();
            throw new InternalErrors("INTERNAL_SERVER_ERROR", "transaction error in liking post");
        }
    }


    async unLikePost(userId: string, postId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const result = await LikeModel.deleteOne(
                {post_id: postId, user_id: userId},
                {session}
            );
            if (result.deletedCount > 0) {
                await postModel.updateOne(
                    {_id: postId},
                    {$inc: {likeCount: -1}},
                    {session}
                );
            }

            await session.commitTransaction();
            await session.endSession();
        } catch (err) {
            await session.abortTransaction();
            await session.endSession();
            throw new InternalErrors(
                "INTERNAL_SERVER_ERROR",
                "transaction error in unliking post"
            );
        }
    }

}