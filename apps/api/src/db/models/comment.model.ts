import mongoose, {Schema, Types, Document, Model} from "mongoose";
import {z} from "zod";

export interface IComment extends Document {
    _id: Types.ObjectId;
    post_id: Types.ObjectId;         // رفرنس به Post
    user_id: Types.ObjectId;         // کسی که کامنت گذاشته
    content: string;                 // متن کامنت
    like_count: number;              // تعداد لایک
    parent_comment?: Types.ObjectId | null; // اگر ریپلای باشه
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
    {
        post_id: {type: Schema.Types.ObjectId, ref: "Posts", required: true},
        user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
        content: {type: String, required: true, maxlength: 1000},
        like_count: {type: Number, default: 0},
        parent_comment: {type: Schema.Types.ObjectId, ref: "Comment", default: null},
    },
    {
        timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"},
    }
);


export const insertCommentSchema = z.object({
    post_id: z.string(),
    content: z.string().min(1, "Content is required").max(1000, "Content too long"),
    parent_comment: z.string().optional().nullable(),
});

export type InsertCommentDto = z.infer<typeof insertCommentSchema>;

export const CommentModel: Model<IComment> = mongoose.model<IComment>("Comment", CommentSchema);
