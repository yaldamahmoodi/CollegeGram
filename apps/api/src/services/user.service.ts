import type {UserRepository} from "../repositories/user.repository.ts";
import type {ProfileRepository} from "../repositories/profile.repository.ts";
import bcrypt from 'bcrypt';
import type {updateProfileUserSchema} from "../db/models/user.model.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import type {FollowRepository} from "../repositories/follow.repository.ts";
import { WebSocketService } from "./websocket.service.ts";
import type { NotificationService } from "./notification.service.ts";

export class UserService {

    private readonly userRepository: UserRepository;
    private readonly profilePhotoRepository: ProfileRepository;
    private readonly followRepository: FollowRepository;
    private readonly notificationService: NotificationService;


    constructor(userRepository: UserRepository, profilePhotoRepository: ProfileRepository, followRepository: FollowRepository, notificationService: NotificationService) {
        this.userRepository = userRepository;
        this.profilePhotoRepository = profilePhotoRepository;
        this.followRepository = followRepository;
        this.notificationService = notificationService;
    }

    async getUserIdByUsername(username: string): Promise<string | null> {
        return await this.userRepository.findUserIdByUsername(username);
    }

    async uploadProfile(filePath: string, userId: string) {
        const findUserById = await this.userRepository.findByUserId(userId);
        if (!findUserById) {
            throw new NotFoundError("NOT_FOUND_USER");
        }

        return await this.profilePhotoRepository.upsertProfilePhoto(findUserById._id, filePath);
    }

    async getProfile(userId: string) {
        const userDetails = await this.userRepository.findUserDetails(userId);
        if (!userDetails) {
            throw new NotFoundError("NOT_FOUND_USER");
        }
        return userDetails;
    }

    async updateProfile(userId: string, userData: updateProfileUserSchema) {

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        return await this.userRepository.updateUser(userId, userData);
    }

    async followUser(userId: string, followedUserId: string) {
        const result = await this.followRepository.followUser(userId, followedUserId);
        
        const sender = await this.userRepository.findUserDetails(userId);
        if (sender) {
            await this.notificationService.createFollowNotification(
                followedUserId,
                userId,
                sender.username
            );
        }
        
        return result;
    }

    async unfollowUser(userId: string, unfollowedUserId: string) {
        return await this.followRepository.unfollowUser(userId, unfollowedUserId);
    }

    async getFollowings(userId: string) {
        return this.followRepository.getFollowings(userId)
    }

    async getFollowers(userId: string) {
        return this.followRepository.getFollowers(userId)
    }

    async getOtherProfile(loggedInUserId: string, targetUsername: string) {
        const userDetails = await this.userRepository.findUserDetailsByUsername(targetUsername);
        if (!userDetails) {
            throw new NotFoundError("NOT_FOUND_USER");
        }

        const isFollowed = await this.followRepository.isFollowed(
            loggedInUserId,
            userDetails._id.toString()
        );

        return {
            ...userDetails,
            isFollowed,
        };
    }

}