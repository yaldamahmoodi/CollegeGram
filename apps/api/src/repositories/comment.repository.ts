import {CommentModel, type IComment} from "../db/models/comment.model.ts";
import mongoose from "mongoose";
import {commentLikeModel} from "../db/models/commentLike.model.ts"
export class CommentRepository {
    async findCommentById(commentId: string): Promise<Comment> {
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

    async getCommentsByPostId(postId: string, skip: number, pageSize: number): Promise<IComment[]> {
        return await CommentModel.aggregate([
            {$match: {post_id: new mongoose.Types.ObjectId(postId)}},
            {$skip: skip},
            {$limit: pageSize}
        ]);

    }

    async commentLikedBefore(userId:string , commentId: string){
    return await commentLikeModel.findOne({ user_id: userId, comment_id: commentId }).exec() 
    }

  async likeComment(userId:string , commentId: string) {
      const like = await commentLikeModel.updateOne(
      {user_id: userId , comment_id: commentId},
      {$setOnInsert: {user_id: userId , comment_id: commentId, createdAt: new Date()}},
      {upsert: true}
      )

      if (like.upsertedCount > 0) {
        await CommentModel.updateOne(
        { _id: commentId },
        { $inc: { like_count: 1 } }
     );
     }
  }  
  async unlikeComment(userId: string , commentId: string) {
    const unlike = await commentLikeModel.deleteOne({
        user_id:userId,
        comment_id: commentId
    })
      if (unlike.deletedCount > 0){
          await CommentModel.updateOne(
          { _id: commentId},
          {$inc: {like_count: -1}},
        )
      }
    }

  }



