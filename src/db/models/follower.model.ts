import mongoose, {type Model, Schema, Types} from "mongoose";

export interface IFollower {
    _id: Types.ObjectId,
    user_id: Types.ObjectId
    follower_id: Types.ObjectId
    createdAt: Date
}

const FollowerSchema: Schema<IFollower> = new Schema({
        user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
        follower_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    },
    {
        timestamps: {createdAt: 'createdAt'},
    }
);

export const FollowerModel: Model<IFollower> = mongoose.model<IFollower>('Followers', FollowerSchema);


