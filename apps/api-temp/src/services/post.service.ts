import {PostRepository} from "../repositories/post.repository.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import type {SaveRepository} from "../repositories/save.repository.ts";
import {AlreadyDoneError} from "../utils/errors/alreadyDone.errors.ts";
import {BadRequestErrors} from "../utils/errors/badRequest.errors.ts";
import {type InsertPostDto} from "../db/models/post.model.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";
import {InternalErrors} from "../utils/errors/internal.errors.ts";

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

    async getPosts(userId: string, page: number, pageSize: number) {
        return await this.postRepository.findUserPosts(userId, page, pageSize);
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

    async savePost(userId: string, postId: string) {
        const postExistence = await this.postRepository.getPostById(postId);
        if (!postExistence) throw new NotFoundError("NOT_FOUND");

        const save = await this.saveRepository.savePost(postId, userId);
        if (save.acknowledged == false) throw new InternalErrors("INTERNAL_SERVER_ERROR");

        if (save.upsertedCount > 0) {
            await this.postRepository.updatePostSaveCount(postId, 1);
        }

        if (save.upsertedCount == 0) {
            throw new AlreadyDoneError("ALREADY_SAVED", 'post already saved');
        }

        return save;
    }

    async unsavePost(userId: string, postId: string) {
        const postExistence = await this.postRepository.getPostById(postId)
        if (!postExistence) {
            throw new NotFoundError("NOT_FOUND");
        }
        const existingSave = await this.saveRepository.findSave(postId, userId);
        if (!existingSave) {
            throw new BadRequestErrors("NOT_SAVED", 'Post already not saved');
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

    async explore(userId: string, page: number, pageSize: number) {
        return await this.postRepository.explore(userId, page, pageSize);
        }
}