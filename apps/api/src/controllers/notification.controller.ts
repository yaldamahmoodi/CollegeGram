import type { Authenticate } from "../middlewares/auth.middleware.ts";
import type { NextFunction, Response, Request } from "express";
import type { NotificationService } from "../services/notification.service.ts";
import { APIError } from "../utils/errors/api.errors.ts";
import { asyncHandler } from "../utils/asyncHandler.utils.ts";
import type { NotificationQueryDto } from "../db/models/notification.model.ts";

export class NotificationController {

    private readonly notificationService: NotificationService;

    constructor(notificationService: NotificationService) {
        this.notificationService = notificationService;
        this.getNotifications = this.getNotifications.bind(this);
        this.getUnreadCount = this.getUnreadCount.bind(this);
        this.markAsRead = this.markAsRead.bind(this);
        this.markAllAsRead = this.markAllAsRead.bind(this);
        this.deleteNotification = this.deleteNotification.bind(this);
        this.deleteAllNotifications = this.deleteAllNotifications.bind(this);
        this.getNotificationById = this.getNotificationById.bind(this);
        this.getMyNotifications = this.getMyNotifications.bind(this);
        this.getFriendsActivity = this.getFriendsActivity.bind(this);
    }

    async getNotifications(req: Authenticate<{}, {}, {}, NotificationQueryDto>, res: Response, next: NextFunction) {
        try {
            const notifications = await this.notificationService.getUserNotifications(req.user.id, req.query);
            
            // Transform profile photo paths to full URLs
            const transformedNotifications = this.transformProfilePhotoUrls(notifications, req);
            
            return res.status(200).json({
                code: "GET_NOTIFICATIONS_SUCCESSFULLY",
                data: transformedNotifications
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
            return next(error);
        }
    }

    async getUnreadCount(req: Authenticate, res: Response, next: NextFunction) {
        try {
            const count = await this.notificationService.getUnreadCount(req.user.id);
            
            return res.status(200).json({
                code: "GET_UNREAD_COUNT_SUCCESSFULLY",
                data: { unreadCount: count }
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
            return next(error);
        }
    }

    async markAsRead(req: Authenticate<{ id: string }>, res: Response, next: NextFunction) {
        try {
            const notification = await this.notificationService.markAsRead(req.params.id, req.user.id);
            
            return res.status(200).json({
                code: "NOTIFICATION_MARKED_AS_READ",
                message: "Notification marked as read successfully",
                data: notification
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
            return next(error);
        }
    }

    async markAllAsRead(req: Authenticate, res: Response, next: NextFunction) {
        try {
            const result = await this.notificationService.markAllAsRead(req.user.id);
            
            return res.status(200).json({
                code: "ALL_NOTIFICATIONS_MARKED_AS_READ",
                message: "All notifications marked as read successfully",
                data: result
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
            return next(error);
        }
    }

    async deleteNotification(req: Authenticate<{ id: string }>, res: Response, next: NextFunction) {
        try {
            const result = await this.notificationService.deleteNotification(req.params.id, req.user.id);
            
            return res.status(200).json({
                code: "NOTIFICATION_DELETED",
                message: "Notification deleted successfully",
                data: result
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
            return next(error);
        }
    }

    async deleteAllNotifications(req: Authenticate, res: Response, next: NextFunction) {
        try {
            const result = await this.notificationService.deleteAllNotifications(req.user.id);
            
            return res.status(200).json({
                code: "ALL_NOTIFICATIONS_DELETED",
                message: "All notifications deleted successfully",
                data: result
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
            return next(error);
        }
    }

    async getNotificationById(req: Authenticate<{ id: string }>, res: Response, next: NextFunction) {
        try {
            const notification = await this.notificationService.getNotificationById(req.params.id, req.user.id);
            
            return res.status(200).json({
                code: "GET_NOTIFICATION_SUCCESSFULLY",
                data: notification
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
            return next(error);
        }
    }

    async getMyNotifications(req: Authenticate<{}, {}, {}, NotificationQueryDto>, res: Response, next: NextFunction) {
        try {
            const notifications = await this.notificationService.getMyNotifications(req.user.id, req.query);
            
            // Transform profile photo paths to full URLs
            const transformedNotifications = this.transformProfilePhotoUrls(notifications, req);
            
            return res.status(200).json({
                code: "GET_MY_NOTIFICATIONS_SUCCESSFULLY",
                data: transformedNotifications
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
            return next(error);
        }
    }

    async getFriendsActivity(req: Authenticate<{}, {}, {}, NotificationQueryDto>, res: Response, next: NextFunction) {
        try {
            const notifications = await this.notificationService.getFriendsActivity(req.user.id, req.query);
            
            // Transform profile photo paths to full URLs
            const transformedNotifications = this.transformProfilePhotoUrls(notifications, req);
            
            return res.status(200).json({
                code: "GET_FRIENDS_ACTIVITY_SUCCESSFULLY",
                data: transformedNotifications
            });
        } catch (error: unknown) {
            if (error instanceof APIError) return next(error);
            return next(error);
        }
    }

    private transformProfilePhotoUrls(notifications: any, req: any) {
        if (notifications.data && Array.isArray(notifications.data)) {
            notifications.data = notifications.data.map((notification: any) => {
                if (notification.senderId && notification.senderId.ProfilePhoto?.path) {
                    const currentPath = notification.senderId.ProfilePhoto.path;
                    // Check if the path is already a full URL
                    if (!currentPath.startsWith('http://') && !currentPath.startsWith('https://')) {
                        notification.senderId.ProfilePhoto.path = `${req.protocol}://${req.get("host")}/uploads/profiles/${currentPath}`;
                    }
                }
                return notification;
            });
        }
        return notifications;
    }
}
