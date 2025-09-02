import {type IUser, UserModel, type insertUserZodSchema} from "../db/models/user.model.ts";
import {type Post, postModel} from "../db/models/post.model.ts";

export class UserRepository {

    async findByUserId(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId);
    }

    async findUserDetails(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId)
            .populate("ProfilePhoto", "path");
    }

    async updateUser(username: string, userData: Partial<insertUserZodSchema>) {
        return await UserModel.updateOne(
            {username},
            {$set: userData},
        ).exec();
    }
    // This is Amir's code
    // The query related to the posts model must be in the corresponding repository
    async findUserPosts(userId: string): Promise<Post[]> {
        return postModel.find({user_id: userId}, {urls: {$slice: 1}, photo_length: 1});
    }

    async findPost(postId: string): Promise<Post | null> {
    return postModel.findById(postId);
    }
}