import mongoose, {type Model, Schema, Types} from "mongoose";

export interface ILike {
    _id: Types.ObjectId,
    comment_id: Types.ObjectId,
    user_id: Types.ObjectId, // liked user id
    createdAt: Date,
}

const LikeSchema: Schema<ILike> = new Schema({
        user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
        comment_id: {type: Schema.Types.ObjectId, ref: "comment", required: true},
    },
    {
        timestamps: {createdAt: 'createdAt'}
    });
export const commentLikeModel: Model<ILike> = mongoose.model<ILike>('Likes', LikeSchema);

