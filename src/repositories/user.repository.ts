import {type IUser, UserModel} from "../db/models/user.model.js";

export class UserRepositoryYaldoo{
    async  findByUserId(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId);
    }

}