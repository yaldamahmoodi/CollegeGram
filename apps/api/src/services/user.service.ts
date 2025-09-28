import type {UserRepository} from "../repositories/user.repository.ts";
import type {ProfileRepository} from "../repositories/profile.repository.ts";
import bcrypt from 'bcrypt';
import type {updateProfileUserSchema} from "../db/models/user.model.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import type {FollowRepository} from "../repositories/follow.repository.ts";

export class UserService {

    private readonly userRepository: UserRepository;
    private readonly profilePhotoRepository: ProfileRepository;
    private readonly followRepository: FollowRepository;


    constructor(userRepository: UserRepository, profilePhotoRepository: ProfileRepository, followRepository: FollowRepository) {
        this.userRepository = userRepository;
        this.profilePhotoRepository = profilePhotoRepository;
        this.followRepository = followRepository;
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
        return await this.followRepository.followUser(userId, followedUserId);
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

        const followStatus = await this.followRepository.isFollowed(
            loggedInUserId,
            userDetails._id.toString()
        );

        // const isBlocked = await this.blockRepository.isBlocked(
        //     loggedInUserId,
        //     userDetails._id.toString()
        // );

        const isBlocked = false;

        // const hasBlocked = await this.blockRepository.hasBlocked(
        //     loggedInUserId,
        //     userDetails._id.toString()
        // );

        const hasBlocked = false;
        const isCloseFriend = await this.followRepository.isCloseFriend(
            loggedInUserId,
            userDetails._id.toString()
        );


        return {
            ...userDetails,
            followStatus: isFollowed,
            isBlocked,
            hasBlocked,
            isCloseFriend,
        };
    }

}