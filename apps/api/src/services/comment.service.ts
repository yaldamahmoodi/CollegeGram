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

        return this.commentRepository.createComment(
            userId,
            commentData.post_id,
            commentData.content,
            commentData.parent_comment || null
        );
    }

    async getCommentsByPost(postId: string, page: number, pageSize: number) {
        console.log("getCommentsByPost", postId);
        const post = await this.postRepository.getPostById(postId);
        if (!post) throw new NotFoundError("NOT_FOUND");

        return this.commentRepository.getCommentsByPostId(postId, page, pageSize);
    }
}