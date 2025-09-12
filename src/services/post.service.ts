import {PostRepository} from "../repositories/post.repository.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import type {SaveRepository} from "../repositories/save.repository.ts";
import {AlreadyDoneError} from "../utils/errors/alreadyDone.errors.ts";
import {BadRequestErrors} from "../utils/errors/badRequest.errors.ts";
import {type InsertPostDto} from "../db/models/post.model.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";

export class PostService {

    private readonly postRepository: PostRepository;
    private readonly saveRepository: SaveRepository;

    constructor(postRepository: PostRepository, saveRepository: SaveRepository) {
        this.postRepository = postRepository;
        this.saveRepository = saveRepository;

    }

    async createPost(postData: InsertPostDto) {
        if (postData.urls.length < 1) {
            throw new ValidationError("INVALID_CREDENTIALS");
        }
        const allExist = postData.mentions.every(async (mention) => {
            return await this.getUserDetails(mention.user_id)
        })

        if (!allExist) {
            throw new ValidationError("INVALID_USERNAME");
        }

        return await this.postRepository.createPost(postData);
    }

    async getUserDetails(userId: string) {
        const userDetails = await this.postRepository.findUserDetails(userId);
        if (!userDetails) {
            throw new NotFoundError("NOT_FOUND_USER");
        }
        return userDetails;
    }

    async getPosts(userId: string) {
        return await this.postRepository.findUserPosts(userId);
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