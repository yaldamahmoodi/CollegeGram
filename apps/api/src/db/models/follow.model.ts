import mongoose, {type Model, Schema, Types} from "mongoose";

export interface IFollow {
    _id: Types.ObjectId,
    follower_id: Types.ObjectId,
    following_id: Types.ObjectId,
    createdAt: Date
}

const FollowSchema: Schema<IFollow> = new Schema({
    follower_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    following_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
}, {
    timestamps: {createdAt: 'createdAt'},
});
export const Follow: Model<IFollow> = mongoose.model<IFollow>("Follow", FollowSchema);