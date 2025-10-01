import { Router } from "express";
import { errorHandler } from "../../middlewares/error.middleware.ts";
import { initiator } from "../../initiator.ts";
import { authMiddleware } from "../../middlewares/auth.middleware.ts";

const router = Router();
const notificationController = initiator.getNotificationController();

router.use(authMiddleware);

router.get("/", notificationController.getNotifications);

router.get("/unread-count", notificationController.getUnreadCount);

router.get("/:id", notificationController.getNotificationById);

router.patch("/:id/read", notificationController.markAsRead);

router.patch("/read-all", notificationController.markAllAsRead);

router.delete("/:id", notificationController.deleteNotification);

router.delete("/", notificationController.deleteAllNotifications);

router.use(errorHandler);

export default router;