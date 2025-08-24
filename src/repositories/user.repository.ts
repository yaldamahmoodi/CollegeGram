import {type IUser, UserModel} from "../db/models/user.model.ts";

export class UserRepository{
   static async findByUserId(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId);
    }
}