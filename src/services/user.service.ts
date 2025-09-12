import type {UserRepository} from "../repositories/user.repository.ts";
import type {ProfileRepository} from "../repositories/profile.repository.ts";
import type {FollowUnfollowRepository} from "../repositories/followUnfollow.repository.ts";
import bcrypt from 'bcrypt';
import type {updateProfileUserSchema} from "../db/models/user.model.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import {BadRequestErrors} from "../utils/errors/badRequest.errors.ts";

export class UserService {

    private readonly userRepository: UserRepository;
    private readonly profilePhotoRepository: ProfileRepository;
    private readonly followUnfollowRepository: FollowUnfollowRepository;


    constructor(userRepository: UserRepository, profilePhotoRepository: ProfileRepository, followUnfollowRepository: FollowUnfollowRepository) {
        this.userRepository = userRepository;
        this.profilePhotoRepository = profilePhotoRepository;
        this.followUnfollowRepository = followUnfollowRepository;
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

    async updateProfile(userId: string, userData: updateProfileUserSchema) {

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        return await this.userRepository.updateUser(userId, userData);
    }

    async followUser(userId: string, followedUserId: string) {
        return await this.followUnfollowRepository.followUser(userId, followedUserId);
    }

    async unfollowUser(userId: string, unfollowedUserId: string) {
        return await this.followUnfollowRepository.unfollowUser(userId, unfollowedUserId);
    }

}