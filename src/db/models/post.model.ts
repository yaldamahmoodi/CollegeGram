import mongoose, {Schema, Types} from "mongoose";
import {z} from "zod"

export interface IPostSchema extends Document {
    _id: string;
    user_id: Types.ObjectId;
    urls: Array<string>;
    caption: string;
    photo_length: Number;
}


const postSchema: Schema<IPostSchema> = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    urls: {type: [String], required: true,},
    caption: {type: String, optional: true},
    photo_length: {type: Number, required: true},
})

export const postModel = mongoose.model<IPostSchema>('Posts', postSchema)

export const insertPostSchema = z.object({
    user_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    urls: z.array(z.string()).min(1, "At least one URL required"),
    caption: z.string().max(500).optional(),
    photo_length: z.number().int().positive(),
})

export const selectPostZodSchema = z.object({
    _id: z.string(),
    user_id: z.string(),
    urls: z.array(z.string()),
    caption: z.string().nullable().optional(),
    photo_length: z.number(),
})

export const selectPostsArrayZodSchema = z.array(selectPostZodSchema)