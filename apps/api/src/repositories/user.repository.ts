import {type IUser, UserModel, type updateProfileUserSchema} from "../db/models/user.model.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";
import {ElasticClient} from "../services/elasticClient.service.ts";
import {UserSearchService} from "../services/UserSearchService.ts";

const elasticClient = new ElasticClient();
const userSearchService = new UserSearchService(elasticClient);

export class UserRepository {

    async findByUserId(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId);
    }

    async findUserDetails(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId)
            .populate("ProfilePhoto", "path").lean();
    }

    async findUserDetailsByUsername(username: string): Promise<IUser | null> {
        return await UserModel.findOne({ username })
            .populate("ProfilePhoto", "path")
            .lean();
    }


    async updateUser(userId: string, userData: updateProfileUserSchema) {
        const user = await UserModel.findOneAndUpdate(
            {_id: userId},
            {$set: userData},
            {new: true}
        ).populate("ProfilePhoto").exec();

        if (!user) {
            throw new NotFoundError("NOT_FOUND_USER");
        } else {
            try {
                await userSearchService.indexUser(user);
            } catch (err) {
                console.error(`Failed to index user ${userId} in ES after profile photo update:`, err);
            }
        }

        return user;
    }

    async findUserIdByUsername(username: string): Promise<string | null> {
        const user = await UserModel.findOne({username}, {_id: 1});
        return user ? user._id.toString() : null;
    }

}