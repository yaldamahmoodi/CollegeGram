import {type insertUserZodSchema, UserModel, type IUser} from "../db/models/user.model.ts";


export class AuthRepository {

    async createUser(userData: insertUserZodSchema): Promise<IUser> {
        return await UserModel.create(userData);
    }

    async findByUsername(username: string): Promise<IUser | null> {
        return await UserModel.findOne({username}).exec();
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({email}).exec();
    }

    async updatePassword(userId: string, hashedPassword: string): Promise<boolean> {
        try {
            const result = await UserModel.findByIdAndUpdate(
                userId,
                { password: hashedPassword },
                { new: true }
            ).exec();
            
            return !!result;
        } catch (error) {
            console.error('Error updating password:', error);
            return false;
        }
    }

    async verifyEmail(userId: string): Promise<boolean> {
        try {
            const result = await UserModel.findByIdAndUpdate(
                userId,
                { emailVerified: true },
                { new: true }
            ).exec();
            
            return !!result;
        } catch (error) {
            console.error('Error verifying email:', error);
            return false;
        }
    }

    async isEmailVerified(email: string): Promise<boolean> {
        try {
            const user = await UserModel.findOne({ email }).select('emailVerified').exec();
            return user?.emailVerified || false;
        } catch (error) {
            console.error('Error checking email verification status:', error);
            return false;
        }
    }

}