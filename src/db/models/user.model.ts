import mongoose, {Document, type Model, Schema, Types} from "mongoose";
import {z} from "zod";

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    firstName?: string | null;
    lastName?: string | null;
    biography?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        email: {type: String, required: true, unique: true, maxlength: 255},
        username: {type: String, required: true, unique: true, maxlength: 255},
        password: {type: String, required: true, maxlength: 255},
        firstName: {type: String, maxlength: 255, default: null},
        lastName: {type: String, maxlength: 255, default: null},
        biography: {type: String, maxlength: 1500, default: null},
    },
    {
        timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'},
    }
);

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export const insertUserSchema = z.object({
    email: z.email().max(255),
    username: z.string().min(1).max(255),
    password: z.string().min(6).max(255),
    firstName: z.string().max(255).nullable().optional(),
    lastName: z.string().max(255).nullable().optional(),
    biography: z.string().max(1500).nullable().optional(),
});

export const selectUserSchema = z.object({
    _id: z.string(),
    email: z.email(),
    username: z.string(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    biography: z.string().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type insertUserZodSchema = z.infer<typeof insertUserSchema>;
export type selectUserZodSchema = z.infer<typeof selectUserSchema>;