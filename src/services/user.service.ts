import {ProfilePhotoModel} from "../db/models/profile-photo.model.ts";
import {UserRepository} from "../repositories/user.repository.ts";

export class UserService {

    static async uploadProfile( filePath: string, userId: string ) {

        const findUserById = await UserRepository.findByUserId(userId);
        if (!findUserById) {
            throw new Error('User not found');
        }

        const profile = await ProfilePhotoModel.create({
            path: filePath,
            user_id: findUserById._id
        });


        return profile;

    }

}