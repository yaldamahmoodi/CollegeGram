import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { websocketService } from "@/services/serviceWorker";
import { NOTIFICATION_QUERY_KEYS } from "./notification.hook";

/**
 * Custom hook to manage WebSocket connection and real-time notifications
 * @param token - User authentication token
 */
export const useWebSocket = (token?: string) => {
  const queryClient = useQueryClient();

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

    // Set up listeners for different notification types
    websocketService.onLikeNotification(handleNewNotification);
    websocketService.onCommentNotification(handleNewNotification);
    websocketService.onMentionNotification(handleNewNotification);
    websocketService.onFollowNotification(handleNewNotification);
    websocketService.onSaveNotification(handleNewNotification);
    websocketService.onReplyNotification(handleNewNotification);
    websocketService.onNotificationCount(handleNotificationCount);

    // Cleanup on unmount
    return () => {
      websocketService.offLikeNotification(handleNewNotification);
      websocketService.offCommentNotification(handleNewNotification);
      websocketService.offMentionNotification(handleNewNotification);
      websocketService.offFollowNotification(handleNewNotification);
      websocketService.offSaveNotification(handleNewNotification);
      websocketService.offReplyNotification(handleNewNotification);
      websocketService.offNotificationCount(handleNotificationCount);
      websocketService.disconnect();
    };
  }, [token, queryClient]);

  return {
    isConnected: websocketService.isConnected(),
  };
};

