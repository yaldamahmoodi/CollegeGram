import { CommentModel } from "../db/models/comment.model.ts";
import mongoose from "mongoose";
import {commentLikeModel} from "../db/models/commentLike.model.ts"
import {type IComment} from "../db/models/comment.model.ts";

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

    async commentLikedBefore(user_id:string , comment_id: string){
      return commentLikeModel.findOne({ user_id, comment_id }).exec()  
    }

  async likeComment(userId:string , commentId: string) {
    const likeComment_session = await mongoose.startSession();
    likeComment_session.startTransaction()
    try{
      const like = await commentLikeModel.updateOne(
      {user_id: userId , comment_id: commentId},
      {$setOnInsert: {user_id: userId , comment_id: commentId, createdAt: new Date()}},
      {upsert: true , session: likeComment_session}
      )

      if (like.upsertedCount > 0) {
    await CommentModel.updateOne(
        { _id: commentId },
        { $inc: { like_count: 1 } },
        { session: likeComment_session }
     );
     }
    await likeComment_session.commitTransaction();
    await likeComment_session.endSession()
  }
 catch(err){
    await likeComment_session.abortTransaction()
    await likeComment_session.endSession()
  }
  }
  

  async unLikeComment(userId: string , commentId: string) {
    const unLikeComment_session = await mongoose.startSession()
    unLikeComment_session.startTransaction()
     try{
      const unlike = await commentLikeModel.deleteOne(
       {user_id: userId , comment_id: commentId},
       {session: unLikeComment_session}
      )
      if (unlike.deletedCount > 0){
        await CommentModel.updateOne(
          { _id: commentId},
            {$inc: {like_count: -1}},
            {session: unLikeComment_session}
        )
      }
      await unLikeComment_session.commitTransaction()
      await unLikeComment_session.endSession()
    }
    catch{
      await unLikeComment_session.abortTransaction()
      await unLikeComment_session.endSession()

    }
    }

  }



