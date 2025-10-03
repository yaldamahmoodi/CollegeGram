import { CommentModel, type IComment } from "../db/models/comment.model.ts";
import mongoose from "mongoose";
import { commentLikeModel } from "../db/models/commentLike.model.ts";
export class CommentRepository {
  async findCommentById(commentId: string): Promise<IComment | null> {
    return CommentModel.findById(commentId);
  }

  async createComment(
    userId: string,
    postId: string,
    content: string,
    parentComment: string | null
  ): Promise<IComment> {
    return CommentModel.create({
      post_id: postId,
      user_id: userId,
      content,
      parent_comment: parentComment,
    });
  }


  async getCommentsByPostId(
      postId: string,
      page: number,
      pageSize: number,
      userId?: string
  ) {
    const pipeline: any[] = [
      {
        $match: { post_id: new mongoose.Types.ObjectId(postId) }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_info"
        }
      },
      {
        $unwind: "$user_info"
      }
    ];

    // Add isLiked lookup if userId is provided
    if (userId) {
      pipeline.push({
        $lookup: {
          from: "commentlikes",
          let: { commentId: "$_id", userId: new mongoose.Types.ObjectId(userId) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$comment_id", "$$commentId"] },
                    { $eq: ["$user_id", "$$userId"] }
                  ]
                }
              }
            }
          ],
          as: "user_like"
        }
      });
    }

    pipeline.push({
      $project: {
        _id: 1,
        content: 1,
        like_count: 1,
        parent_comment: 1,
        createdAt: 1,
        updatedAt: 1,
        isLiked: userId ? { $gt: [{ $size: "$user_like" }, 0] } : false,
        "user_info._id": 1,
        "user_info.username": 1,
        "user_info.firstname": 1,
        "user_info.lastname": 1,
        "user_info.profilePhoto": {
          $ifNull: ["$user_info.ProfilePhoto.path", null]
        }
      }
    });

    pipeline.push(
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize }
    );

    return CommentModel.aggregate(pipeline);
  }



  async commentLikedBefore(userId: string, commentId: string) {
    return await commentLikeModel
      .findOne({ user_id: userId, comment_id: commentId })
      .exec();
  }

  async likeComment(userId: string, commentId: string) {
    const like = await commentLikeModel.updateOne(
      { user_id: userId, comment_id: commentId },
      {
        $setOnInsert: {
          user_id: userId,
          comment_id: commentId,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    if (like.upsertedCount > 0) {
      await CommentModel.updateOne(
        { _id: commentId },
        { $inc: { like_count: 1 } }
      );
    }
  }
  async unlikeComment(userId: string, commentId: string) {
    const unlike = await commentLikeModel.deleteOne({
      user_id: userId,
      comment_id: commentId,
    });
    if (unlike.deletedCount > 0) {
      await CommentModel.updateOne(
        { _id: commentId },
        { $inc: { like_count: -1 } }
      );
    }
  }
}
