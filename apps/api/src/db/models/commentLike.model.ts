import mongoose, {type Model, Schema, Types} from "mongoose";

export interface ICommentLike {
    _id: Types.ObjectId,
    comment_id: Types.ObjectId,
    user_id: Types.ObjectId, 
    createdAt: Date,
}

const LikeSchema: Schema<ICommentLike> = new Schema({
        user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
        comment_id: {type: Schema.Types.ObjectId, ref: "comment", required: true},
    },
    {
        timestamps: {createdAt: 'createdAt'}
    });
export const commentLikeModel: Model<ICommentLike> = mongoose.model<ICommentLike>('CommentLikes', LikeSchema);

