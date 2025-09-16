
import mongoose, {type Model, Schema, Types} from "mongoose";

export interface IFollowing {
    _id: Types.ObjectId,
    user_id: Types.ObjectId
    following_id: Types.ObjectId
    createdAt: Date
}

const FollowingSchema: Schema<IFollowing> = new Schema({
        user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
        following_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    },
    {
        timestamps: {createdAt: 'createdAt'},
    }
);

export const FollowingModel: Model<IFollowing> = mongoose.model<IFollowing>('Followings', FollowingSchema);


