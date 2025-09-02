import mongoose, {Schema, Types} from "mongoose";
import {z} from "zod"


 interface Mention {
  user_id: Types.ObjectId;
  username: string;
}


export interface Post extends Document {
    _id: string;
    user_id: Types.ObjectId;
    urls: Array<string>;
    caption?: string;
    photo_length: number;
    like_count: number;
    save_count: number;
    mentions?: Mention[];
    hashtag_array: Array<string>; 
}


const postSchema: Schema<Post> = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    urls: {type: [String], required: true,},
    caption: {type: String, required: false},
    photo_length: {type: Number, required: false},
    like_count: { type: Number, default: 0 },
    save_count: { type: Number, default: 0 },
    mentions: {
    type: [{ user_id: { type: Schema.Types.ObjectId, ref: "User" },
            username: String }] as any,
            default: [],
    },
    hashtag_array: { type: [String], default: [] },
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
    
    like_count: z.number().optional().default(0),
    save_count: z.number().optional().default(0),
    mentions: z.array(
    z.object({
      user_id: z.string().regex(/^[0-9a-fA-F]{24}$/),
      username: z.string(),
    })
    ).optional().default([]),
    hashtag_array: z.array(z.string()).optional().default([]), // 👈 پیش‌فرض []
})

export const selectPostZodSchema = z.object({
    _id: z.string(),
    user_id: z.string(),
    urls: z.array(z.string()),
    caption: z.string().nullable().optional(),
    photo_length: z.number(),

    like_count: z.number(),
    save_count: z.number(),
    mentions: z.array(
        z.object({
        user_id: z.string(),
        username: z.string(),
        })
    ).optional().default([]),
    hashtag_array: z.array(z.string()).optional().default([]),
})

export type InsertPostDto = z.infer<typeof insertPostSchema>;

export const selectPostsArrayZodSchema = z.array(selectPostZodSchema)