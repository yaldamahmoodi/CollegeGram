import api from "../axios";
import { NOTIFICATION_URLS } from "./urls";
import type { NotificationQueryParams } from "@app-types/notification";

export const getNotifications = async (params?: NotificationQueryParams) => {
  const { data } = await api.get(NOTIFICATION_URLS.GET_ALL, { params });
  return data;
};

export const getMyNotifications = async (params?: Omit<NotificationQueryParams, 'tab'>) => {
  const { data } = await api.get(NOTIFICATION_URLS.GET_MY_NOTIFICATIONS, { params });
  return data;
};

export const getFriendsActivity = async (params?: Omit<NotificationQueryParams, 'tab'>) => {
  const { data } = await api.get(NOTIFICATION_URLS.GET_FRIENDS_ACTIVITY, { params });
  return data;
};

export const getNotificationById = async (id: string) => {
  const { data } = await api.get(NOTIFICATION_URLS.GET_BY_ID(id));
  return data;
};

export const getUnreadCount = async () => {
  const { data } = await api.get(NOTIFICATION_URLS.UNREAD_COUNT);
  return data;
};

export const markAsRead = async (id: string) => {
  const { data } = await api.patch(NOTIFICATION_URLS.MARK_AS_READ(id));
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await api.patch(NOTIFICATION_URLS.MARK_ALL_AS_READ);
  return data;
};

export const deleteNotification = async (id: string) => {
  const { data } = await api.delete(NOTIFICATION_URLS.DELETE(id));
  return data;
};

export const deleteAllNotifications = async () => {
  const { data } = await api.delete(NOTIFICATION_URLS.DELETE_ALL);
  return data;
};

