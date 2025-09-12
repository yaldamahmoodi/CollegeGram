import {PostRepository} from "../repositories/post.repository.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import type {SaveRepository} from "../repositories/save.repository.ts";
import {AlreadyDoneError} from "../utils/errors/alreadyDone.errors.ts";
import {BadRequestErrors} from "../utils/errors/badRequest.errors.ts";

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
        const existingSave = await this.saveRepository.findSave(postId, userId);
        if (existingSave) {
            throw new AlreadyDoneError('ALREADY_SAVED')
        }
        await this.postRepository.updatePostSaveCount(postId, 1)
        return this.saveRepository.savePost(postId, userId);
    }

    async unsavePost(userId: string, postId: string) {
        const postExistence = await this.postRepository.getPostById(postId)
        if (!postExistence) {
            throw new NotFoundError("NOT_FOUND");
        }
        const existingSave = await this.saveRepository.findSave(postId, userId);
        if (!existingSave) {
            throw new BadRequestErrors("NOT_SAVED");
        }
        await this.postRepository.updatePostSaveCount(postId, -1)
        return this.saveRepository.unsavePost(userId, postId);
    }

    async getSavePosts(userId: string, page: number, pageSize: number) {
        const savePosts = await this.saveRepository.getSavesListByUserId(userId, page, pageSize);
        if (savePosts.data.length === 0) {
            throw new NotFoundError("SAVE_NOT_FOUND");
        }
        return savePosts;
    }
}