import { NotificationRepository } from "../repositories/notification.repository.ts";
import { WebSocketService } from "./websocket.service.ts";
import { NotFoundError } from "../utils/errors/notFound.errors.ts";
import { ValidationError } from "../utils/errors/validation.errors.ts";
import type { CreateNotificationDto, UpdateNotificationDto, NotificationQueryDto } from "../db/models/notification.model.ts";

export class NotificationService {

    private readonly notificationRepository: NotificationRepository;
    private readonly webSocketService: WebSocketService;

    constructor(notificationRepository: NotificationRepository, webSocketService: WebSocketService) {
        this.notificationRepository = notificationRepository;
        this.webSocketService = webSocketService;
        this.createNotification = this.createNotification.bind(this);
        this.getUserNotifications = this.getUserNotifications.bind(this);
        this.getUnreadCount = this.getUnreadCount.bind(this);
        this.markAsRead = this.markAsRead.bind(this);
        this.markAllAsRead = this.markAllAsRead.bind(this);
        this.deleteNotification = this.deleteNotification.bind(this);
        this.deleteAllNotifications = this.deleteAllNotifications.bind(this);
        this.getNotificationById = this.getNotificationById.bind(this);
        this.createLikeNotification = this.createLikeNotification.bind(this);
        this.createCommentNotification = this.createCommentNotification.bind(this);
        this.createMentionNotification = this.createMentionNotification.bind(this);
        this.createFollowNotification = this.createFollowNotification.bind(this);
        this.createReplyNotification = this.createReplyNotification.bind(this);
        this.createSaveNotification = this.createSaveNotification.bind(this);
    }

    async createNotification(notificationData: CreateNotificationDto) {
        if (notificationData.recipientId === notificationData.senderId) {
            return null;
        }
        const exists = await this.notificationRepository.notificationExists(
            notificationData.recipientId,
            notificationData.senderId,
            notificationData.type,
            notificationData.postId,
            notificationData.commentId
        );

        if (exists) {
            return null; 
        }

        const notification = await this.notificationRepository.createNotification(notificationData);
        
        this.sendRealtimeNotification(notification);
        
        return notification;
    }

    async getUserNotifications(userId: string, query: NotificationQueryDto) {
        return await this.notificationRepository.getUserNotifications(userId, query);
    }

    async getUnreadCount(userId: string): Promise<number> {
        return await this.notificationRepository.getUnreadCount(userId);
    }

    async markAsRead(notificationId: string, userId: string) {
        const notification = await this.notificationRepository.markAsRead(notificationId, userId);
        
        if (!notification) {
            throw new NotFoundError("NOTIFICATION_NOT_FOUND");
        }

        const unreadCount = await this.getUnreadCount(userId);
        this.webSocketService.sendNotificationCount(userId, unreadCount);

        return notification;
    }

    async markAllAsRead(userId: string) {
        const result = await this.notificationRepository.markAllAsRead(userId);
        this.webSocketService.sendNotificationCount(userId, 0);

        return result;
    }

    async deleteNotification(notificationId: string, userId: string) {
        const deleted = await this.notificationRepository.deleteNotification(notificationId, userId);
        
        if (!deleted) {
            throw new NotFoundError("NOTIFICATION_NOT_FOUND");
        }

        const unreadCount = await this.getUnreadCount(userId);
        this.webSocketService.sendNotificationCount(userId, unreadCount);

        return { success: true };
    }

    async deleteAllNotifications(userId: string) {
        const result = await this.notificationRepository.deleteAllNotifications(userId);
        
        this.webSocketService.sendNotificationCount(userId, 0);

        return result;
    }

    async getNotificationById(notificationId: string, userId: string) {
        const notification = await this.notificationRepository.getNotificationById(notificationId, userId);
        
        if (!notification) {
            throw new NotFoundError("NOTIFICATION_NOT_FOUND");
        }

        return notification;
    }

    private sendRealtimeNotification(notification: any) {
        const notificationData = {
            _id: notification._id,
            type: notification.type,
            senderId: notification.senderId,
            postId: notification.postId,
            commentId: notification.commentId,
            data: notification.data,
            isRead: notification.isRead,
            createdAt: notification.createdAt
        };

        switch (notification.type) {
            case 'like':
                this.webSocketService.sendLikeNotification(notification.recipientId.toString(), {
                    type: 'like',
                    postId: notification.postId?.toString() || '',
                    senderUsername: notification.data.senderUsername,
                    senderId: notification.senderId.toString(),
                    timestamp: notification.createdAt.toISOString()
                });
                break;
            case 'comment':
                this.webSocketService.sendCommentNotification(notification.recipientId.toString(), {
                    type: 'comment',
                    postId: notification.postId?.toString() || '',
                    commentId: notification.commentId?.toString() || '',
                    senderUsername: notification.data.senderUsername,
                    senderId: notification.senderId.toString(),
                    timestamp: notification.createdAt.toISOString()
                });
                break;
            case 'mention':
                this.webSocketService.sendMentionNotification(notification.recipientId.toString(), {
                    type: 'mention',
                    postId: notification.postId?.toString() || '',
                    senderUsername: notification.data.senderUsername,
                    senderId: notification.senderId.toString(),
                    timestamp: notification.createdAt.toISOString()
                });
                break;
            case 'follow':
                this.webSocketService.sendFollowNotification(notification.recipientId.toString(), {
                    type: 'follow',
                    senderUsername: notification.data.senderUsername,
                    senderId: notification.senderId.toString(),
                    timestamp: notification.createdAt.toISOString()
                });
                break;
            default:
                this.webSocketService.sendNotification(notification.recipientId.toString(), notification.type, notificationData);
        }

        this.sendUnreadCountUpdate(notification.recipientId.toString());
    }

    private async sendUnreadCountUpdate(userId: string) {
        const unreadCount = await this.getUnreadCount(userId);
        this.webSocketService.sendNotificationCount(userId, unreadCount);
    }

    async createLikeNotification(recipientId: string, senderId: string, senderUsername: string, postId: string, postCaption?: string) {
        return await this.createNotification({
            recipientId,
            senderId,
            type: 'like',
            postId,
            data: {
                senderUsername,
                postCaption: postCaption || ''
            }
        });
    }

    async createCommentNotification(recipientId: string, senderId: string, senderUsername: string, postId: string, commentId: string, commentContent?: string, postCaption?: string) {
        return await this.createNotification({
            recipientId,
            senderId,
            type: 'comment',
            postId,
            commentId,
            data: {
                senderUsername,
                commentContent: commentContent || '',
                postCaption: postCaption || ''
            }
        });
    }

    async createMentionNotification(recipientId: string, senderId: string, senderUsername: string, postId: string, postCaption?: string) {
        return await this.createNotification({
            recipientId,
            senderId,
            type: 'mention',
            postId,
            data: {
                senderUsername,
                postCaption: postCaption || ''
            }
        });
    }

    async createFollowNotification(recipientId: string, senderId: string, senderUsername: string) {
        return await this.createNotification({
            recipientId,
            senderId,
            type: 'follow',
            data: {
                senderUsername
            }
        });
    }

    async createReplyNotification(recipientId: string, senderId: string, senderUsername: string, postId: string, commentId: string, commentContent?: string) {
        return await this.createNotification({
            recipientId,
            senderId,
            type: 'reply',
            postId,
            commentId,
            data: {
                senderUsername,
                commentContent: commentContent || ''
            }
        });
    }


    async createSaveNotification(recipientId: string, senderId: string, senderUsername: string, postId: string, postCaption?: string) {
        return await this.createNotification({
            recipientId,
            senderId,
            type: 'save',
            postId,
            data: {
                senderUsername,
                postCaption: postCaption || ''
            }
        });
    }
}
