export type NotificationType = 'like' | 'comment' | 'mention' | 'follow' | 'reply' | 'save';

export interface Notification {
  _id: string;
  recipientId: string;
  senderId: string;
  type: NotificationType;
  postId?: string;
  commentId?: string;
  isRead: boolean;
  data: {
    senderUsername: string;
    postCaption?: string;
    commentContent?: string;
    [key: string]: string | undefined;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationQueryParams {
  page?: number;
  pageSize?: number;
  type?: NotificationType;
  isRead?: boolean;
}

export interface NotificationResponse {
  code: string;
  data: {
    data: Notification[];
    totalCount: number;
    page: string;
    pageSize: string;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  code: string;
  data: {
    unreadCount: number;
  };
}

