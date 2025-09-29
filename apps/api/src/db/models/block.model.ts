import mongoose, { Schema, Types, Document, Model } from "mongoose";

export interface IBlock extends Document {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;       // صاحب لیست
    blocked_id: Types.ObjectId;    // کسی که بلاک شده
    createdAt: Date;
}

const BlockSchema: Schema<IBlock> = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        blocked_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: {createdAt:true} }
);
export const Block: Model<IBlock> = mongoose.model<IBlock>("block", BlockSchema);
