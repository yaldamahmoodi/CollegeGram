import {type insertUserZodSchema, UserModel, type IUser} from "../db/models/user.model.ts";


export class authRepository {

    static async createUser(userData: insertUserZodSchema): Promise<IUser> {
        return await UserModel.create(userData);
    }

    static async findByUsername(username: string): Promise<IUser | null> {
        return await UserModel.findOne({username}).exec();
    }

    static async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({email}).exec();
    }

}