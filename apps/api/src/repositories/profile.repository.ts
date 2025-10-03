import {type ProfilePhoto, ProfilePhotoModel} from "../db/models/profile-photo.model.ts";
import {UserModel} from "../db/models/user.model.ts";
import {ElasticClient} from "../services/elasticClient.service.ts";
import {UserSearchService} from "../services/UserSearchService.ts";
import { BlockRepository } from "./block.repository.ts";

const elasticClient = new ElasticClient();
const blockRepository = new BlockRepository();
const userSearchService = new UserSearchService(elasticClient, blockRepository);

export class ProfileRepository {

    async upsertProfilePhoto(userId: any, filePath: string): Promise<ProfilePhoto | null> {
        const profile = await ProfilePhotoModel.findOneAndUpdate(
            {user_id: userId},
            {path: filePath},
            {new: true, upsert: true}
        );

        try {
            const user = await UserModel.findById(userId).populate("ProfilePhoto");
            if (user) {
                await userSearchService.indexUser(user);
            }
        } catch (err) {
            console.error(`Failed to index user ${userId} in ES after profile photo update:`, err);
        }

        return profile;
    }
}