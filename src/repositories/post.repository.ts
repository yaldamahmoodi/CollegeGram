import {type InsertPostDto, type Post, postModel} from "../db/models/post.model.ts";
import {LikeModel} from "../db/models/like.model.ts";
import {Types} from "mongoose";
import {UserModel, type IUser} from "../db/models/user.model.ts";
import {AlreadyDoneError} from "../utils/errors/alreadyDone.errors.ts";
import {FollowingModel} from "../db/models/following.model.ts";

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

    async explore(userId: string, page: number, pageSize: number) {

        const skip = (page - 1) * pageSize;

        return FollowingModel.aggregate([
            // 1️⃣ Find all users that the logged-in user follows
            {$match: {user_id: new Types.ObjectId(userId)}},

            // 2️⃣ Lookup posts for each followed user
            {
                $lookup: {
                    from: "posts",
                    localField: "following_id",
                    foreignField: "user_id",
                    as: "posts",
                },
            },

            // 3️⃣ Flatten posts array
            {$unwind: {path: "$posts", preserveNullAndEmptyArrays: false}},

            // 4️⃣ Lookup user info for the post author
            {
                $lookup: {
                    from: "users",
                    localField: "following_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {$unwind: {path: "$user", preserveNullAndEmptyArrays: false}},

            // 5️⃣ Sort posts by createdAt descending
            {$sort: {"posts.createdAt": -1}},

            // 6️⃣ Pagination
            {$skip: skip},
            {$limit: Number(pageSize)},

            // 7️⃣ Project required fields
            {
                $project: {
                    _id: 0,
                    post_id: "$posts._id",
                    urls: "$posts.urls",
                    like_count: "$posts.like_count",
                    save_count: "$posts.save_count",
                    comment_count: "$posts.comment_count",
                    createdAt: "$posts.createdAt",

                    userId: "$user._id",
                    firstname: "$user.firstname",
                    lastname: "$user.lastname",
                    following_count: "$user.following_count",
                    profilePhotoUrl: "$user.profilePhotoUrl",
                },
            },
        ]);


    }

}