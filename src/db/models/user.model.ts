import mongoose, {Model, Schema, Types} from "mongoose";
import {z} from "zod";

export interface IUser {
    _id: Types.ObjectId
    email: string;
    username: string;
    password: string;
    firstname?: string | null;
    lastname?: string | null;
    biography?: string | null;
    ProfilePhoto?: {
        _id: Types.ObjectId;
        path: string;
        user_id: Types.ObjectId;
    };
    follower_count?: number;
    following_count?: number;
    post_count?: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        email: {type: String, required: true, unique: true, maxlength: 255},
        username: {type: String, required: true, unique: true, minlength: 5, maxlength: 20, match: /^[a-zA-Z0-9_-]{5,}$/, trim: true},
        password: {type: String, required: true, maxlength: 20},
        firstname: {type: String, maxlength: 255, default: null},
        lastname: {type: String, maxlength: 255, default: null},
        biography: {type: String, maxlength: 1500, default: null},
        follower_count: { type: Number, default: 0 },
        following_count: { type: Number, default: 0 },
        post_count: { type: Number, default: 0 },
    },
    {
        timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'},
    }
);


UserSchema.virtual("ProfilePhoto", {
    ref: "ProfilePhoto",
    localField: "_id",
    foreignField: "user_id",
    justOne: true
})

UserSchema.set("toObject", {virtuals: true});
UserSchema.set("toJSON", {virtuals: true});


export const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export const insertUserSchema = z.object({
    email: z.email().max(255),
    username: z.string().min(5).max(20).regex(/^[a-zA-Z0-9_-]{5,}/),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
    firstname: z.string().max(255).nullable().optional(),
    lastname: z.string().max(255).nullable().optional(),
    biography: z.string().max(1500).nullable().optional(),
});


export const selectUserSchema = z.object({
    _id: z.string(),
    email: z.email(),
    username: z.string(),
    firstname: z.string().nullable().optional(),
    lastname: z.string().nullable().optional(),
    biography: z.string().nullable().optional(),
    follower_count: z.number(),
    following_count: z.number(),
    post_count: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
});


export const updateProfileUserSchema = z.object({
    email: z.email().max(255).optional(),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/).max(20).optional(),
    firstname: z.string().max(255).nullable().optional(),
    lastname: z.string().max(255).nullable().optional(),
    biography: z.string().max(1500).nullable().optional(),
});


export type insertUserZodSchema = z.infer<typeof insertUserSchema>;
export type selectUserZodSchema = z.infer<typeof selectUserSchema>;
export type updateProfileUserSchema = z.infer<typeof updateProfileUserSchema>;