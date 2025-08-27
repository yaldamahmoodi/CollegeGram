import mongoose, {Schema, Types} from "mongoose";
import {z} from "zod"

export interface Post extends Document {
    _id: string;
    user_id: Types.ObjectId;
    urls: Array<string>;
    caption?: string;
    photo_length: Number;
}


const postSchema: Schema<Post> = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    urls: {type: [String], required: true,},
    caption: {type: String, required: false},
    photo_length: {type: Number, required: false},
})

//pre-save hook
postSchema.pre('save', async function (next) {
    this.photo_length = this.urls.length;
    next();
})

export const postModel = mongoose.model<Post>('Posts', postSchema)

export const insertPostSchema = z.object({
    user_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    urls: z.array(z.string()).min(1, "At least one URL required"),
    caption: z.string().max(500).optional(),
})

export const selectPostZodSchema = z.object({
    _id: z.string(),
    user_id: z.string(),
    urls: z.array(z.string()),
    caption: z.string().nullable().optional(),
    photo_length: z.number(),
})

export type InsertPostDto = z.infer<typeof insertPostSchema>;

export const selectPostsArrayZodSchema = z.array(selectPostZodSchema)