import {CommentModel, type IComment} from "../db/models/comment.model.ts";

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

}