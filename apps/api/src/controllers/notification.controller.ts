import type { Authenticate } from "../middlewares/auth.middleware.ts";
import type { NextFunction, Response } from "express";
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
    }

    async getNotifications(req: Authenticate<{}, {}, {}, NotificationQueryDto>, res: Response, next: NextFunction) {
        try {
            const notifications = await this.notificationService.getUserNotifications(req.user.id, req.query);
            
            return res.status(200).json({
                code: "GET_NOTIFICATIONS_SUCCESSFULLY",
                data: notifications
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
}
