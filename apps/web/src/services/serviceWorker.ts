import { io, Socket } from "socket.io-client";

export interface LikeNotification {
  type: "like";
  postId: string;
  senderUsername: string;
  senderId: string;
  timestamp: string;
}

export interface CommentNotification {
  type: "comment";
  postId: string;
  commentId: string;
  senderUsername: string;
  senderId: string;
  timestamp: string;
}

export interface MentionNotification {
  type: "mention";
  postId: string;
  senderUsername: string;
  senderId: string;
  timestamp: string;
}

export interface FollowNotification {
  type: "follow";
  senderUsername: string;
  senderId: string;
  timestamp: string;
}

export interface SaveNotification {
  type: "save";
  postId: string;
  senderUsername: string;
  senderId: string;
  timestamp: string;
}

export interface ReplyNotification {
  type: "reply";
  postId: string;
  commentId: string;
  senderUsername: string;
  senderId: string;
  timestamp: string;
}

export type NotificationData =
  | LikeNotification
  | CommentNotification
  | MentionNotification
  | FollowNotification
  | SaveNotification
  | ReplyNotification;

class WebSocketService {
  private socket: Socket | null = null;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
  }

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(this.baseUrl, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from WebSocket server:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Notification listeners
  onLikeNotification(callback: (notification: LikeNotification) => void) {
    this.socket?.on("like_notification", callback);
  }

  onCommentNotification(callback: (notification: CommentNotification) => void) {
    this.socket?.on("comment_notification", callback);
  }

  onMentionNotification(callback: (notification: MentionNotification) => void) {
    this.socket?.on("mention_notification", callback);
  }

  onFollowNotification(callback: (notification: FollowNotification) => void) {
    this.socket?.on("follow_notification", callback);
  }

  onSaveNotification(callback: (notification: SaveNotification) => void) {
    this.socket?.on("save_notification", callback);
  }

  onReplyNotification(callback: (notification: ReplyNotification) => void) {
    this.socket?.on("reply_notification", callback);
  }

  onNotificationCount(callback: (data: { count: number; timestamp: string }) => void) {
    this.socket?.on("notification_count", callback);
  }

  onNotification(callback: (data: { type: string; data: unknown; timestamp: string }) => void) {
    this.socket?.on("notification", callback);
  }

  // Remove listeners
  offLikeNotification(callback?: (notification: LikeNotification) => void) {
    this.socket?.off("like_notification", callback);
  }

  offCommentNotification(callback?: (notification: CommentNotification) => void) {
    this.socket?.off("comment_notification", callback);
  }

  offMentionNotification(callback?: (notification: MentionNotification) => void) {
    this.socket?.off("mention_notification", callback);
  }

  offFollowNotification(callback?: (notification: FollowNotification) => void) {
    this.socket?.off("follow_notification", callback);
  }

  offSaveNotification(callback?: (notification: SaveNotification) => void) {
    this.socket?.off("save_notification", callback);
  }

  offReplyNotification(callback?: (notification: ReplyNotification) => void) {
    this.socket?.off("reply_notification", callback);
  }

  offNotificationCount(callback?: (data: { count: number; timestamp: string }) => void) {
    this.socket?.off("notification_count", callback);
  }

  offNotification(callback?: (data: { type: string; data: unknown; timestamp: string }) => void) {
    this.socket?.off("notification", callback);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const websocketService = new WebSocketService();

