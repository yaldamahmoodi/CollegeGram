import {type insertUserZodSchema, UserModel, type IUser} from "../db/models/user.model.ts";


export class authRepository {

    async createUser(userData: insertUserZodSchema): Promise<IUser> {
        return await UserModel.create(userData);
    }

    async findByUsername(username: string): Promise<IUser | null> {
        return await UserModel.findOne({username}).exec();
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({email}).exec();
    }

}