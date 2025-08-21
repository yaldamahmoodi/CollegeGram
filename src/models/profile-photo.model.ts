import mongoose, {type Model, Schema, Types} from "mongoose";
import {Document} from "bson";

export interface ProfilePhoto extends Document {
    path: string;
    user_id: Types.ObjectId;
    uploadedAt: Date;
}

const ProfilePhotoSchema: Schema<ProfilePhoto> = new Schema(
    {
        path: { type: String, required: true },
        user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    },
    {
        timestamps: { createdAt: 'uploadedAt', updatedAt: false }
    }
);

export const ProfilePhotoModel: Model<ProfilePhoto> = mongoose.model<ProfilePhoto>('ProfilePhoto', ProfilePhotoSchema);