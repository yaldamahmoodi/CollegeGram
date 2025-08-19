import mongoose, {Schema, Types} from "mongoose";
import {UUID} from "node:crypto";
import {Document} from "mongoose";

export interface AuthenticationDocument extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    refreshToken: string;
    createdAt: Date;
    expiresAt: Date;
    status: "active" | "revoked";
}

const AuthenticationSchema = new Schema<AuthenticationDocument>({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    refreshToken: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    expiresAt: {type: Date, required: false},
    status: {type: String, required: true, default: 'active'},
})

export const AuthenticationModel = mongoose.model<AuthenticationDocument>('Authentication', AuthenticationSchema);