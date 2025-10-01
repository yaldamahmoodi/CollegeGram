import { NotificationModel, type INotification, type CreateNotificationDto, type UpdateNotificationDto, type NotificationQueryDto } from "../db/models/notification.model.ts";
import { FollowModel } from "../db/models/follow.model.ts";
import { Types } from "mongoose";

export class NotificationRepository {

    async createNotification(notificationData: CreateNotificationDto): Promise<INotification> {
        const notification = new NotificationModel({
            recipientId: new Types.ObjectId(notificationData.recipientId),
            senderId: new Types.ObjectId(notificationData.senderId),
            type: notificationData.type,
            postId: notificationData.postId ? new Types.ObjectId(notificationData.postId) : undefined,
            commentId: notificationData.commentId ? new Types.ObjectId(notificationData.commentId) : undefined,
            data: notificationData.data,
        });

        return await notification.save();
    }

    async getUserNotifications(userId: string, query: NotificationQueryDto) {
        const { page, pageSize, type, isRead } = query;
        const skip = (page - 1) * pageSize;

        const filter: any = { recipientId: new Types.ObjectId(userId) };
        
        if (type) {
            filter.type = type;
        }
        
        if (isRead !== undefined) {
            filter.isRead = isRead;
        }

        const totalCount = await NotificationModel.countDocuments(filter);
        
        const notifications = await NotificationModel.find(filter)
            .populate({
                path: 'senderId',
                select: 'username firstname lastname',
                populate: {
                    path: 'ProfilePhoto',
                    select: 'path'
                }
            })
            .populate('postId', 'caption urls')
            .populate('commentId', 'content')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

        return {
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            data: notifications
        };
    }

    async getUnreadCount(userId: string): Promise<number> {
        return await NotificationModel.countDocuments({
            recipientId: new Types.ObjectId(userId),
            isRead: false
        });
    }

    async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
        return await NotificationModel.findOneAndUpdate(
            { 
                _id: new Types.ObjectId(notificationId),
                recipientId: new Types.ObjectId(userId)
            },
            { isRead: true },
            { new: true }
        );
    }

    async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
        const result = await NotificationModel.updateMany(
            { 
                recipientId: new Types.ObjectId(userId),
                isRead: false
            },
            { isRead: true }
        );

        return { modifiedCount: result.modifiedCount };
    }

    async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
        const result = await NotificationModel.deleteOne({
            _id: new Types.ObjectId(notificationId),
            recipientId: new Types.ObjectId(userId)
        });

        return result.deletedCount > 0;
    }

    async deleteAllNotifications(userId: string): Promise<{ deletedCount: number }> {
        const result = await NotificationModel.deleteMany({
            recipientId: new Types.ObjectId(userId)
        });

        return { deletedCount: result.deletedCount };
    }

    async getNotificationById(notificationId: string, userId: string): Promise<INotification | null> {
        return await NotificationModel.findOne({
            _id: new Types.ObjectId(notificationId),
            recipientId: new Types.ObjectId(userId)
        })
        .populate('senderId', 'username firstname lastname')
        .populate('postId', 'caption urls')
        .populate('commentId', 'content');
    }

    async notificationExists(
        recipientId: string, 
        senderId: string, 
        type: string, 
        postId?: string, 
        commentId?: string
    ): Promise<boolean> {
        const filter: any = {
            recipientId: new Types.ObjectId(recipientId),
            senderId: new Types.ObjectId(senderId),
            type
        };

        if (postId) {
            filter.postId = new Types.ObjectId(postId);
        }

        if (commentId) {
            filter.commentId = new Types.ObjectId(commentId);
        }

        const count = await NotificationModel.countDocuments(filter);
        return count > 0;
    }

    async getRecentNotifications(userId: string, hours: number = 24): Promise<INotification[]> {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000);
        
        return await NotificationModel.find({
            recipientId: new Types.ObjectId(userId),
            createdAt: { $gte: since }
        })
        .populate('senderId', 'username firstname lastname')
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
    }

    async getMyNotifications(userId: string, query: NotificationQueryDto) {
        const { page, pageSize, type, isRead } = query;
        const skip = (page - 1) * pageSize;

        const filter: any = { recipientId: new Types.ObjectId(userId) };
        
        if (type) {
            filter.type = type;
        }
        
        if (isRead !== undefined) {
            filter.isRead = isRead;
        }

        const totalCount = await NotificationModel.countDocuments(filter);
        
        const notifications = await NotificationModel.find(filter)
            .populate({
                path: 'senderId',
                select: 'username firstname lastname',
                populate: {
                    path: 'ProfilePhoto',
                    select: 'path'
                }
            })
            .populate('postId', 'caption urls')
            .populate('commentId', 'content')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

        return {
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            data: notifications
        };
    }

    async getFriendsActivity(userId: string, query: NotificationQueryDto) {
        const { page, pageSize, type, isRead } = query;
        const skip = (page - 1) * pageSize;

        // Get user's following list (friends)
        const following = await FollowModel.find({
            follower_id: new Types.ObjectId(userId),
            status: "accepted"
        }).select('following_id');

        const friendIds = following.map(follow => follow.following_id);

        if (friendIds.length === 0) {
            return {
                totalCount: 0,
                page,
                pageSize,
                totalPages: 0,
                data: []
            };
        }

        // Get notifications from friends (where senderId is in friendIds)
        const filter: any = { 
            senderId: { $in: friendIds },
            recipientId: { $ne: new Types.ObjectId(userId) } // Exclude notifications to self
        };
        
        if (type) {
            filter.type = type;
        }
        
        if (isRead !== undefined) {
            filter.isRead = isRead;
        }

        const totalCount = await NotificationModel.countDocuments(filter);
        
        const notifications = await NotificationModel.find(filter)
            .populate({
                path: 'senderId',
                select: 'username firstname lastname',
                populate: {
                    path: 'ProfilePhoto',
                    select: 'path'
                }
            })
            .populate('postId', 'caption urls')
            .populate('commentId', 'content')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

        return {
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            data: notifications
        };
    }
}
