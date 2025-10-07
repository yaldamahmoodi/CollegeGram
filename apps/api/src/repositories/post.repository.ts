import {
  type InsertPostDto,
  type Post,
  postModel,
} from "../db/models/post.model.ts";
import { LikeModel } from "../db/models/like.model.ts";
import { SaveModel } from "../db/models/save.model.ts";
import { Types } from "mongoose";
import { UserModel, type IUser } from "../db/models/user.model.ts";
import { AlreadyDoneError } from "../utils/errors/alreadyDone.errors.ts";
import { FollowModel } from "../db/models/follow.model.ts";
import { ElasticClient } from "../services/elasticClient.service.ts";
import { PostSearchService } from "../services/PostSearchService.ts";
import { BlockRepository } from "./block.repository.ts";
import type { ExplorePost } from "../dtos/posts.dto.ts";

const elasticClient = new ElasticClient();
const blockRepository = new BlockRepository();
const postSearchService = new PostSearchService(elasticClient, blockRepository);
export class PostRepository {
  private async safeIndexPost(post: Post) {
    try {
      await postSearchService.indexPost(post);
    } catch (err) {
      console.error(`Failed to index post ${post._id} in ES:`, err);
    }
  }
async findUserPosts(userId: string, page: number, pageSize: number) {
  const totalCount = await postModel.countDocuments({ user_id: userId });
  const data = await postModel
    .find({ user_id: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  // برای هر پست isLiked و isSaved رو اضافه می‌کنیم
  for (const post of data) {
    const like = await LikeModel.findOne({
      post_id: post._id,
      user_id: userId,
    });

    const save = await SaveModel.findOne({
      post_id: post._id,
      user_id: userId,
    });

    (post as any).isLiked = !!like;
    (post as any).isSaved = !!save;
  }
  return {
    totalCount,
    data,
  };
}


  async incrementCommentCount(postId: string) {
    await postModel.findByIdAndUpdate(postId, { $inc: { comment_count: 1 } });
  }

  async decrementCommentCount(postId: string) {
    await postModel.findByIdAndUpdate(postId, { $inc: { comment_count: -1 } });
  }

  async findUserDetails(userId: string): Promise<IUser | null> {
    return await UserModel.findById(userId).populate("ProfilePhoto", "path");
  }

  async createPost(postData: InsertPostDto) {
    const post = new postModel({
      user_id: postData.user_id,
      urls: postData.urls,
      caption: postData.caption,
      mentions: postData.mentions,
      hashtag_array: postData.hashtag_array,
    });

    const savedPost = await post.save();
    if (savedPost) {
      await this.safeIndexPost(savedPost);
    }
    return savedPost;
  }

  async getPostById(postId: string, userId?: string): Promise<Post | null> {
    const post = await postModel
      .findOne({ _id: new Types.ObjectId(postId) })
      .populate({
        path: "user_id",
        select: "_id username firstname lastname",
        populate: {
          path: "ProfilePhoto",
          select: "path",
        },
      })
      .exec();

    if (post && userId) {
      // Check if the user has liked this post
      const like = await LikeModel.findOne({
        post_id: postId,
        user_id: userId,
      });

      // Check if the user has saved this post
      const save = await SaveModel.findOne({
        post_id: postId,
        user_id: userId,
      });

      (post as any).isLiked = !!like;
      (post as any).isSaved = !!save;
    }

    return post;
  }

  async updatePostSaveCount(postId: string, count: number) {
    const updatedPost = await postModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { save_count: count } },
      { new: true }
    );

    if (updatedPost) {
      await this.safeIndexPost(updatedPost);
    }
    return updatedPost;
  }

  async likePost(userId: string, postId: string) {
    const like = await LikeModel.updateOne(
      { post_id: postId, user_id: userId },
      {
        $setOnInsert: {
          post_id: postId,
          user_id: userId,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    if (like.upsertedCount > 0) {
      const updatedPost = await postModel.findOneAndUpdate(
        { _id: postId },
        { $inc: { like_count: 1 } },
        { new: true }
      );

      if (updatedPost) {
        await this.safeIndexPost(updatedPost as Post);
      }
    }

    if (like.upsertedCount == 0) {
      throw new AlreadyDoneError("ALREADY_DONE", "post liked before");
    }

    return like;
  }

  async unLikePost(userId: string, postId: string) {
    const result = await LikeModel.deleteOne({
      post_id: postId,
      user_id: userId,
    });
    if (result.deletedCount > 0) {
      const updatedPost = await postModel.findOneAndUpdate(
        { _id: postId },
        { $inc: { like_count: -1 } },
        { new: true }
      );

      if (updatedPost) {
        await this.safeIndexPost(updatedPost as Post);
      }
    }
    if (result.deletedCount == 0) {
      throw new AlreadyDoneError("ALREADY_DONE", "post unliked before");
    }

    return result;
  }

  async explore(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<ExplorePost[]> {
    const skip = (page - 1) * pageSize;

    return FollowModel.aggregate([
      { $match: { follower_id: new Types.ObjectId(userId) } },

      {
        $lookup: {
          from: "posts",
          localField: "following_id",
          foreignField: "user_id",
          as: "posts",
        },
      },

      { $unwind: { path: "$posts", preserveNullAndEmptyArrays: false } },

      {
        $lookup: {
          from: "users",
          localField: "following_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: false } },

      {
        $lookup: {
          from: "profilephotos",
          localField: "user._id",
          foreignField: "user_id",
          as: "profilePhoto",
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { postId: "$posts._id", userId: new Types.ObjectId(userId) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$post_id", "$$postId"] },
                    { $eq: ["$user_id", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "userLike",
        },
      },
      {
        $lookup: {
          from: "saves",
          let: { postId: "$posts._id", userId: new Types.ObjectId(userId) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$post_id", "$$postId"] },
                    { $eq: ["$user_id", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "userSave",
        },
      },
      { $sort: { "posts.createdAt": -1 } },

      { $skip: skip },
      { $limit: Number(pageSize) },

      {
        $project: {
          _id: 0,
          post_id: "$posts._id",
          urls: "$posts.urls",
          like_count: "$posts.like_count",
          save_count: "$posts.save_count",
          comment_count: { $ifNull: ["$posts.comment_count", 0] },
          createdAt: "$posts.createdAt",
          user_id: "$posts.user_id",
          caption: "$posts.caption",
          hashtag_array: "$posts.hashtag_array",
          photo_length: "$posts.photo_length",
          mentions: "$posts.mentions",
          isClose: "$posts.isClose",
          userId: "$user._id",
          firstname: "$user.firstname",
          lastname: "$user.lastname",
          following_count: "$user.following_count",
          profilePhotoUrl: {
            $cond: {
              if: { $gt: [{ $size: "$profilePhoto" }, 0] },
              then: { $arrayElemAt: ["$profilePhoto.path", 0] },
              else: null,
            },
          },
          
          isLiked: { $gt: [{ $size: "$userLike" }, 0] },
          isSaved: { $gt: [{ $size: "$userSave" }, 0] },
        },
      },
    ]);
  }

  async getMentionedPosts(userId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const posts = await postModel.aggregate([
      {
        $match: {
          "mentions.user_id": new Types.ObjectId(userId),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: pageSize,
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "profilephotos",
          localField: "user._id",
          foreignField: "user_id",
          as: "profilePhoto",
        },
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          urls: 1,
          caption: 1,
          like_count: 1,
          save_count: 1,
          mentions: 1,
          hashtag_array: 1,
          photo_length: 1,
          createdAt: 1,
          user: {
            _id: "$user._id",
            username: "$user.username",
            firstname: "$user.firstname",
            lastname: "$user.lastname",
          },
          profilePhotoUrl: {
            $cond: {
              if: { $gt: [{ $size: "$profilePhoto" }, 0] },
              then: { $arrayElemAt: ["$profilePhoto.path", 0] },
              else: null,
            },
          },
        },
      },
    ]);

    const totalCount = await postModel.countDocuments({
      "mentions.user_id": new Types.ObjectId(userId),
    });

    return {
      totalCount,
      data: posts,
    };
  }
}
