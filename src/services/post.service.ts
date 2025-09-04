
import {PostRepository} from "../repositories/post.repository.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import type {SaveRepository} from "../repositories/save.repository.ts";

export class PostService {

    private readonly postRepository: PostRepository;
    private readonly saveRepository: SaveRepository;

    constructor(postRepository: PostRepository, saveRepository: SaveRepository) {
        this.postRepository = postRepository;
        this.saveRepository = saveRepository;
    }

    async getPost(postId: string) {
        const post = await this.postRepository.getPostById(postId);
        if (!post) {
            throw new NotFoundError("NOT_FOUND");
        }
        return post;

    }

    async likePost(userId: string, postId: string) {
        await this.getPost(postId)
        await this.postRepository.likePost(userId, postId)
    }

    async unLikePost(userId: string, postId: string) {
        await this.getPost(postId)
        await this.postRepository.unLikePost(userId, postId)
    }

//: Promise<Post | null>
    async savePost(userId: string, postId: string) {
        const postExistence = await this.postRepository.getPostById(postId)
        if (!postExistence) {
            throw new NotFoundError("NOT_FOUND");
        }
        await this.postRepository.updatePostSaveCount(postId)
        return this.saveRepository.savePost(userId, postId);
    }

    async unsavePost(userId: string, postId: string) {
        const postExistence = this.postRepository.getPostById(postId)
        if (!postExistence) {
            throw new NotFoundError("NOT_FOUND");
        }

        return this.saveRepository.unsavePost(userId, postId);

    }
}