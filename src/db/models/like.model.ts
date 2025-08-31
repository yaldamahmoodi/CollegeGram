import {Types} from "mongoose";

export interface ILike {
    _id: Types.ObjectId,
    post_id: Types.ObjectId,
    user_id: Types.ObjectId, // liked user id
    createdAt: Date,
}

const LikeSchema: Schema<ILike> = new Schema({
        user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
        post_id: {type: Schema.Types.ObjectId, ref: "Post", required: true},
    },
    {
        timestamps: {createdAt: 'createdAt'}
    });
const LikeModel: Model<ILike> = mongoose.model<ILike>('Likes', LikeSchema);