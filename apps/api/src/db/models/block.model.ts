import mongoose, { Schema, Types, Document, Model } from "mongoose";

export interface IBlacklist extends Document {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;       // صاحب لیست
    blocked_id: Types.ObjectId;    // کسی که بلاک شده
    createdAt: Date;
    updatedAt: Date;
}

const BlacklistSchema: Schema<IBlacklist> = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        blocked_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);