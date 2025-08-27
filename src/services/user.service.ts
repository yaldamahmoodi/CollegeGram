import {ProfilePhotoModel} from "../db/models/profile-photo.model.ts";
import type {UserRepository} from "../repositories/user.repository.ts";

export class UserService {

    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async uploadProfile(filePath: string, userId: string) {

        const findUserById = await this.userRepository.findByUserId(userId);
        if (!findUserById) {
            throw new Error('User not found');
        }

        return await ProfilePhotoModel.create({
            path: filePath,
            user_id: findUserById._id
        });
    }

    async getUserDetails(userId: string) {

        const userDetails = await this.userRepository.findUserDetails(userId);
        if (!userDetails) {
            throw new Error('User not found');
        }
        return userDetails;

    }


}