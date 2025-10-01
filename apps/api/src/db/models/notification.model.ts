import mongoose, { Schema, Types, Document } from "mongoose";
import { z } from "zod";

export interface INotification extends Document {
  _id: string;
  recipientId: Types.ObjectId;
  senderId: Types.ObjectId;
  type: 'like' | 'comment' | 'mention' | 'follow' | 'reply' | 'save';
  postId?: Types.ObjectId;
  commentId?: Types.ObjectId;
  isRead: boolean;
  data: {
    senderUsername: string;
    postCaption?: string;
    commentContent?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema: Schema<INotification> = new Schema({
  recipientId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  senderId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['like', 'comment', 'mention', 'follow', 'reply', 'save'],
    required: true 
  },
  postId: { 
    type: Schema.Types.ObjectId, 
    ref: "Posts",
    required: false 
  },
  commentId: { 
    type: Schema.Types.ObjectId, 
    ref: "Comments",
    required: false 
  },
  isRead: { 
    type: Boolean, 
    default: false,
    index: true 
  },
  data: {
    senderUsername: { type: String, required: true },
    postCaption: { type: String, required: false },
    commentContent: { type: String, required: false },
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ senderId: 1, type: 1 });

export const NotificationModel = mongoose.model<INotification>("Notification", notificationSchema);

export const createNotificationSchema = z.object({
  recipientId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  senderId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  type: z.enum(['like', 'comment', 'mention', 'follow', 'reply', 'save']),
  postId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  commentId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  data: z.object({
    senderUsername: z.string(),
    postCaption: z.string().optional(),
    commentContent: z.string().optional(),
  }).loose(), 
});

export const updateNotificationSchema = z.object({
  isRead: z.boolean().optional(),
});

export const notificationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(10),
  type: z.enum(['like', 'comment', 'mention', 'follow', 'reply']).optional(),
  isRead: z.coerce.boolean().optional(),
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationDto = z.infer<typeof updateNotificationSchema>;
export type NotificationQueryDto = z.infer<typeof notificationQuerySchema>;
