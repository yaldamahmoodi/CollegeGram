import {type IUser, UserModel, type updateProfileUserSchema} from "../db/models/user.model.ts";


export class UserRepository {

    async findByUserId(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId);
    }

    async findUserDetails(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId)
            .populate("ProfilePhoto", "path");
    }

    async updateUser(username: string, userData: updateProfileUserSchema) {
        return await UserModel.updateOne(
            {username},
            {$set: userData},
        ).exec();
    }
    

}