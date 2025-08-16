import {UserDocument, UserModel} from "../models/user.model";
import {SessionDocument, SessionModel} from "../models/session.model";
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

    async createUserSession(sessionId: string, refreshTokenHash: string, userId: string): Promise<SessionDocument> {
        return await SessionModel.create({
            sessionId,
            refreshTokenHash,
            userId: new Types.ObjectId(userId)
        });
    }

    async findSessionById(sessionId: string): Promise<SessionDocument | null> {
        return await SessionModel.findOne({sessionId}).exec();
    }
}