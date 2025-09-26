import {CommentModel, type IComment} from "../db/models/comment.model.ts";
import mongoose from "mongoose";

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
        const here = await CommentModel.aggregate([
            {$match: {post_id: new mongoose.Types.ObjectId(postId)}},
            {$skip: skip},
            {$limit: pageSize}
        ]);
        console.log(here);
        return here;
    }


}