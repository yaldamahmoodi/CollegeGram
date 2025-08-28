import type {UserRepository} from "../repositories/user.repository.ts";
import {APIError} from "../middlewares/error.middleware.ts";
import type {ProfileRepository} from "../repositories/profile.repository.ts";
import {PostRepository} from "../repositories/post.repository.ts";
import {type InsertPostDto} from "../db/models/post.model.ts";
import type {insertUserZodSchema} from "../db/models/user.model.ts";
import bcrypt from 'bcrypt';
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
            throw new Error('User not found');
        }

        return await this.profilePhotoRepository.upsertProfilePhoto(findUserById._id, filePath);
    }

    async getUserDetails(userId: string) {

        const userDetails = await this.userRepository.findUserDetails(userId);
        if (!userDetails) {
            throw new Error('User not found');
        }
        return userDetails;

    }
    async createPost(postData: InsertPostDto) {

        if (postData.urls.length < 1) {
            throw new Error('must have at least 1 files');
        }

        return await this.postRepository.createPost(postData.user_id, postData.urls, postData.caption);
    }

    async profileUpdater(userName:string, userData: insertUserZodSchema){
    
        try {
    
            if(userData.password) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
            }
                
        return await this.userRepository.updateUser(userName, userData);
            
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
            throw new Error('Internal server error')
        }
    
    }
    async getUserPosts(userId: string) {
        const userPosts = await this.userRepository.findUserPosts(userId);
        if (userPosts.length < 0) {
            throw new APIError("No Post Found", 404, "NotFound")
        }

        return userPosts;

    }
}