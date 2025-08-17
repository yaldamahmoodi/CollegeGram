import mongoose, {Schema, Types} from "mongoose";
import {UUID} from "node:crypto";
import {Document} from "mongoose";

export interface SessionDocument extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    refreshTokenHash: string;
    createdAt: Date;
    expiresAt: Date;
    sessionId: string
    status: "active" | "revoked";
}

const SessionSchema = new Schema<SessionDocument>({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    refreshTokenHash: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    expiresAt: {type: Date, required: false},
    sessionId: {type: String, required: true},
    status: {type: String, required: true, default: 'active'},
})

export const SessionModel = mongoose.model<SessionDocument>('Session', SessionSchema);