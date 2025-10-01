import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getMyNotifications,
  getFriendsActivity,
  getNotificationById,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "@/api/notification/notification.api";
import type { NotificationQueryParams } from "@app-types/notification";

export const NOTIFICATION_QUERY_KEYS = {
  all: ["notifications"] as const,
  list: (params?: NotificationQueryParams) => ["notifications", "list", params] as const,
  myNotifications: (params?: Omit<NotificationQueryParams, 'tab'>) => ["notifications", "my", params] as const,
  friendsActivity: (params?: Omit<NotificationQueryParams, 'tab'>) => ["notifications", "friends", params] as const,
  detail: (id: string) => ["notifications", "detail", id] as const,
  unreadCount: ["notifications", "unreadCount"] as const,
};

export const useNotifications = (params?: NotificationQueryParams) => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(params),
    queryFn: () => getNotifications(params),
    select: (response) => ({
      notifications: response.data.data,
      total: response.data.totalCount,
      page: parseInt(response.data.page),
      pageSize: parseInt(response.data.pageSize),
      totalPages: response.data.totalPages,
    }),
  });
};

export const useMyNotifications = (params?: Omit<NotificationQueryParams, 'tab'>) => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.myNotifications(params),
    queryFn: () => getMyNotifications(params),
    select: (response) => ({
      notifications: response.data.data,
      total: response.data.totalCount,
      page: parseInt(response.data.page),
      pageSize: parseInt(response.data.pageSize),
      totalPages: response.data.totalPages,
    }),
  });
};

export const useFriendsActivity = (params?: Omit<NotificationQueryParams, 'tab'>) => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.friendsActivity(params),
    queryFn: () => getFriendsActivity(params),
    select: (response) => ({
      notifications: response.data.data,
      total: response.data.totalCount,
      page: parseInt(response.data.page),
      pageSize: parseInt(response.data.pageSize),
      totalPages: response.data.totalPages,
    }),
  });
};

export const useNotificationById = (id: string) => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.detail(id),
    queryFn: () => getNotificationById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: getUnreadCount,
    select: (response) => response.data.unreadCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount });
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount });
    },
  });
};

