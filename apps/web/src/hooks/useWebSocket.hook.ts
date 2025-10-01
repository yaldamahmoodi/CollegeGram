import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { websocketService, type NotificationData } from "@/services/serviceWorker";
import { NOTIFICATION_QUERY_KEYS } from "./notification.hook";
import { useNotificationStore } from "./useNotificationStore";

/**
 * Custom hook to manage WebSocket connection and real-time notifications
 * @param token - User authentication token
 */
export const useWebSocket = (token?: string) => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!token) {
      return;
    }

    // Connect to WebSocket
    websocketService.connect(token);

    // Listen for notification count updates
    const handleNotificationCount = (data: { count: number; timestamp: string }) => {
      queryClient.setQueryData(NOTIFICATION_QUERY_KEYS.unreadCount, data.count);
    };

    // Listen for new notifications and invalidate queries
    const handleNewNotification = () => {
      // Invalidate all notification queries to refetch
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount });
    };

    // Handle different notification types for toasts
    const handleLikeNotification = (notification: NotificationData) => {
      addNotification(notification, 'like');
      handleNewNotification();
    };

    const handleCommentNotification = (notification: NotificationData) => {
      addNotification(notification, 'comment');
      handleNewNotification();
    };

    const handleMentionNotification = (notification: NotificationData) => {
      addNotification(notification, 'mention');
      handleNewNotification();
    };

    const handleFollowNotification = (notification: NotificationData) => {
      addNotification(notification, 'follow');
      handleNewNotification();
    };

    const handleSaveNotification = (notification: NotificationData) => {
      addNotification(notification, 'save');
      handleNewNotification();
    };

    const handleReplyNotification = (notification: NotificationData) => {
      addNotification(notification, 'reply');
      handleNewNotification();
    };

    // Set up listeners for different notification types
    websocketService.onLikeNotification(handleLikeNotification);
    websocketService.onCommentNotification(handleCommentNotification);
    websocketService.onMentionNotification(handleMentionNotification);
    websocketService.onFollowNotification(handleFollowNotification);
    websocketService.onSaveNotification(handleSaveNotification);
    websocketService.onReplyNotification(handleReplyNotification);
    websocketService.onNotificationCount(handleNotificationCount);

    // Cleanup on unmount
    return () => {
      websocketService.offLikeNotification(handleLikeNotification);
      websocketService.offCommentNotification(handleCommentNotification);
      websocketService.offMentionNotification(handleMentionNotification);
      websocketService.offFollowNotification(handleFollowNotification);
      websocketService.offSaveNotification(handleSaveNotification);
      websocketService.offReplyNotification(handleReplyNotification);
      websocketService.offNotificationCount(handleNotificationCount);
      websocketService.disconnect();
    };
  }, [token, queryClient, addNotification]);

  return {
    isConnected: websocketService.isConnected(),
  };
};

