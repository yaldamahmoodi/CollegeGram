import mongoose, {Schema, Types, Document, Model} from "mongoose";

export interface ICloseFriend extends Document {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;       // کسی که لیست close friends رو داره
    friend_id: Types.ObjectId;     // کسی که توی لیست اضافه شده
    createdAt: Date;
    updatedAt: Date;
}

const CloseFriendSchema: Schema<ICloseFriend> = new Schema(
    {
        user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
        friend_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    },
    {timestamps: true}
);

export const CloseFriendModel: Model<ICloseFriend> = mongoose.model<ICloseFriend>(
    "CloseFriend",
    CloseFriendSchema
);
