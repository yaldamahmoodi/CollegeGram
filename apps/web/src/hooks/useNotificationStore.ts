import { create } from 'zustand';
import { type NotificationData } from '@/services/serviceWorker';

interface ToastNotification {
  id: string;
  timestamp: number;
  type: string;
  senderUsername: string;
  postId?: string;
  commentId?: string;
  senderId: string;
}

interface NotificationStore {
  notifications: ToastNotification[];
  addNotification: (notification: NotificationData, type: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  
  addNotification: (notification: NotificationData, type: string) => {
    const toastNotification: ToastNotification = {
      id: `${type}_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      type: type,
      senderUsername: notification.senderUsername,
      postId: 'postId' in notification ? notification.postId : undefined,
      commentId: 'commentId' in notification ? notification.commentId : undefined,
      senderId: notification.senderId,
    };

    set((state) => ({
      notifications: [toastNotification, ...state.notifications.slice(0, 4)] // Keep max 5 toasts
    }));

    // Auto remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(toastNotification.id);
    }, 5000);
  },
  
  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter(notif => notif.id !== id)
    }));
  },
  
  clearAll: () => {
    set({ notifications: [] });
  }
}));
