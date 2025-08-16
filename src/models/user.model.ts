import mongoose, {Document, Schema, Types} from "mongoose";

export interface UserDocument extends Document {
    _id: Types.ObjectId
    username: string;
    password: string;
    email: string;
}

const UserSchema = new Schema<UserDocument>({
    username: {type: String, required: true, unique: true, minlength: 5},
    password: {type: String, required: true, minlength: 8},
    email: {type: String, required: true, unique: true},
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);