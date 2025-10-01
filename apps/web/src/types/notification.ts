export type NotificationType = 'like' | 'comment' | 'mention' | 'follow' | 'reply' | 'save';

export interface Notification {
  _id: string;
  recipientId: string;
  senderId: {
    _id: string;
    username: string;
    firstname?: string;
    lastname?: string;
    ProfilePhoto?: {
      path: string;
    };
  };
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

export type NotificationTabType = 'myNotifs' | 'friendsActivity';

export interface NotificationQueryParams {
  page?: number;
  pageSize?: number;
  type?: NotificationType;
  tab?: NotificationTabType;
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

