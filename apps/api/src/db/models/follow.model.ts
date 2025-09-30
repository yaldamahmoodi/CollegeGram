import mongoose, { type Model, Schema, Types } from "mongoose";

export interface IFollow {
  _id: Types.ObjectId;
  follower_id: Types.ObjectId;
  following_id: Types.ObjectId;
  status: "pending" | "accepted";
  createdAt: Date;
  updatedAt: Date;
}

const FollowSchema: Schema<IFollow> = new Schema(
  {
    follower_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    following_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);
export const FollowModel: Model<IFollow> = mongoose.model<IFollow>(
  "Follow",
  FollowSchema
);
