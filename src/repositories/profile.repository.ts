import {type ProfilePhoto, ProfilePhotoModel} from "../db/models/profile-photo.model.ts";

export class ProfileRepository {

    async upsertProfilePhoto(userId: any, filePath: string): Promise<ProfilePhoto | null> {
        return await ProfilePhotoModel.findOneAndUpdate(
            {user_id: userId},
            {path: filePath},
            {new: true, upsert: true}
        );
    }
}