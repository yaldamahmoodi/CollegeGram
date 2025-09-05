import type {UserRepository} from "../repositories/user.repository.ts";
import type {ProfileRepository} from "../repositories/profile.repository.ts";
import {PostRepository} from "../repositories/post.repository.ts";
import {type InsertPostDto} from "../db/models/post.model.ts";
import bcrypt from 'bcrypt';
import type {updateProfileUserSchema} from "../db/models/user.model.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import {ValidationError} from "../utils/errors/validation.errors.ts";

export class UserService {

    private readonly userRepository: UserRepository;
    private readonly profilePhotoRepository: ProfileRepository;
    private readonly postRepository: PostRepository;


    constructor(userRepository: UserRepository, profilePhotoRepository: ProfileRepository, postRepository: PostRepository) {
        this.userRepository = userRepository;
        this.profilePhotoRepository = profilePhotoRepository;
        this.postRepository = postRepository;
    }

    async uploadProfile(filePath: string, userId: string) {
        const findUserById = await this.userRepository.findByUserId(userId);
        if (!findUserById) {
            throw new NotFoundError("NOT_FOUND_USER");
        }

        return await this.profilePhotoRepository.upsertProfilePhoto(findUserById._id, filePath);
    }

    async getUserDetails(userId: string) {
        const userDetails = await this.userRepository.findUserDetails(userId);
        if (!userDetails) {
            throw new NotFoundError("NOT_FOUND_USER");
        }
        return userDetails;
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

        return await this.postRepository.createPost(postData.user_id, postData.urls, postData.caption, postData.mentions);
    }

    async updateProfile(userName: string, userData: updateProfileUserSchema) {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        return await this.userRepository.updateUser(userName, userData);
    }

    async getUserPosts(userId: string) {
        return await this.userRepository.findUserPosts(userId);
    }
}