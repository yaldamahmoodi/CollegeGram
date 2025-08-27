import {type ProfilePhoto, ProfilePhotoModel} from "../db/models/profile-photo.model.ts";

export class ProfileRepository {

    async createProfilePhoto(userId: any, filePath: string): Promise<ProfilePhoto | null> {
        return await ProfilePhotoModel.create({
            path: filePath,
            user_id: userId
        });
    }
}