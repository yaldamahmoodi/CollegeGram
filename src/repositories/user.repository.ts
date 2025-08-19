import {UserDocument, UserModel} from "../models/user.model";
import {AuthenticationDocument, AuthenticationModel} from "../models/Authentication.model";
import {Types} from "mongoose";

export interface CreateUserInput {
    username: string;
    password: string;
    email: string;
}

export class UserRepository {

    async createUser(userData: CreateUserInput): Promise<UserDocument> {
        return await UserModel.create(userData);
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        return await UserModel.findOne({username}).exec();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return await UserModel.findOne({email}).exec();
    }

    async createUserAuth(refreshToken: string, userId: string): Promise<AuthenticationDocument> {
        return await AuthenticationModel.create({
            refreshToken,
            userId: new Types.ObjectId(userId)
        });
    }

    async findAuthByToken(refreshToken:string): Promise<AuthenticationDocument | null> {
        return await AuthenticationModel.findOne({refreshToken:refreshToken,status:'active'}).exec();
    }
}