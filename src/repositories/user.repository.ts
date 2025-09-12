import {type IUser, UserModel, type updateProfileUserSchema} from "../db/models/user.model.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";


export class UserRepository {

    async findByUserId(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId);
    }

    async findUserDetails(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId)
            .populate("ProfilePhoto", "path");
    }

    async updateUser(userId: string, userData: updateProfileUserSchema) {
        const user = await UserModel.findOneAndUpdate(
            {_id: userId},
            {$set: userData},
            {new: true}
        ).exec();

        if (!user) {
            throw new NotFoundError("NOT_FOUND_USER");
        }

        return user;
    }


}