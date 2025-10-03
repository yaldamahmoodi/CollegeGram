import {PostRepository} from "../repositories/post.repository.ts";
import type {CommentRepository} from "../repositories/comment.repository.ts";
import type {InsertCommentDto} from "../db/models/comment.model.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";

export class CommentService {

    private readonly postRepository: PostRepository;
    private readonly commentRepository: CommentRepository;

    constructor(postRepository: PostRepository, commentRepository: CommentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    async addComment(userId: string, commentData: InsertCommentDto) {
        const post = await this.postRepository.getPostById(commentData.post_id);
        if (!post) throw new NotFoundError("NOT_FOUND");

        if (commentData.parent_comment) {
            const parent = await this.commentRepository.findCommentById(commentData.parent_comment);
            if (!parent) throw new NotFoundError("NOT_FOUND");
        }

        const comment = await this.commentRepository.createComment(
            userId,
            commentData.post_id,
            commentData.content,
            commentData.parent_comment || null
        );

        // Increment comment_count in the post
        await this.postRepository.incrementCommentCount(commentData.post_id);

        return comment;
    }

    async getCommentsByPost(postId: string, page: number, pageSize: number, userId?: string) {

        const post = await this.postRepository.getPostById(postId);
        if (!post) throw new NotFoundError("NOT_FOUND");

        return this.commentRepository.getCommentsByPostId(postId, page, pageSize, userId);
    }

    async commentLike(userId: string, commentId: string){
        const comment = await this.commentRepository.findCommentById(commentId)
        const existLike = await this.commentRepository.commentLikedBefore(userId,commentId)
        if (!comment) {
            throw new NotFoundError("NOT_FOUND" , "Comment_not_find")
        }
        if(existLike) {
            throw new NotFoundError("ALREADY_DONE" , "User_liked_comment_Before")
        }

        await this.commentRepository.likeComment(userId, commentId)

    }

    async commentUnLike(userId: string, commentId: string){
        const comment = await this.commentRepository.findCommentById(commentId)
        const existLike = await this.commentRepository.commentLikedBefore(userId,commentId)

        if (!comment) {
            throw new NotFoundError("NOT_FOUND" , "Comment_not_find")
        }
        if(!existLike) {
            throw new NotFoundError("NO_DATA_PROVIDED" , "User_Doesnt_liked_comment_Before")
        }

        await this.commentRepository.unlikeComment(userId, commentId)

    }

}