// import { io } from '../server.ts';
import { Server as SocketIOServer } from "socket.io";

export interface LikeNotification {
    type: 'like';
    postId: string;
    senderUsername: string;
    senderId: string;
    timestamp: string;
}

export interface CommentNotification {
    type: 'comment';
    postId: string;
    commentId: string;
    senderUsername: string;
    senderId: string;
    timestamp: string;
}

export interface MentionNotification {
    type: 'mention';
    postId: string;
    senderUsername: string;
    senderId: string;
    timestamp: string;
}

export interface FollowNotification {
    type: 'follow';
    senderUsername: string;
    senderId: string;
    timestamp: string;
}

export type NotificationData = LikeNotification | CommentNotification | MentionNotification | FollowNotification;

export class WebSocketService {
    
    private io: SocketIOServer | null = null;


    init(io: SocketIOServer) {
            this.io = io;
        }
    
    constructor() {
        this.sendLikeNotification = this.sendLikeNotification.bind(this);
        this.sendCommentNotification = this.sendCommentNotification.bind(this);
        this.sendMentionNotification = this.sendMentionNotification.bind(this);
        this.sendFollowNotification = this.sendFollowNotification.bind(this);
        this.sendNotification = this.sendNotification.bind(this);
        this.sendNotificationToUsers = this.sendNotificationToUsers.bind(this);
        this.isUserConnected = this.isUserConnected.bind(this);
        this.getConnectedUsersCount = this.getConnectedUsersCount.bind(this);
        this.getConnectedUserIds = this.getConnectedUserIds.bind(this);
        this.sendNotificationCount = this.sendNotificationCount.bind(this);
        this.broadcast = this.broadcast.bind(this);
    }
    
    sendLikeNotification(recipientId: string, notification: LikeNotification): void {
        if (this.io) {
            this.io.to(`user_${recipientId}`).emit('like_notification', notification);
            console.log(`Like notification sent to user ${recipientId} from ${notification.senderUsername}`);
        }
    }
    
    sendCommentNotification(recipientId: string, notification: CommentNotification): void {
        if (this.io) {
            this.io.to(`user_${recipientId}`).emit('comment_notification', notification);
            console.log(`Comment notification sent to user ${recipientId} from ${notification.senderUsername}`);
        }
    }
    
    sendMentionNotification(recipientId: string, notification: MentionNotification): void {
        if (this.io) {
            this.io.to(`user_${recipientId}`).emit('mention_notification', notification);
            console.log(`Mention notification sent to user ${recipientId} from ${notification.senderUsername}`);
        }
    }
    
    sendFollowNotification(recipientId: string, notification: FollowNotification): void {
        if (this.io) {
            this.io.to(`user_${recipientId}`).emit('follow_notification', notification);
            console.log(`Follow notification sent to user ${recipientId} from ${notification.senderUsername}`);
        }
    }
    
    sendNotification(recipientId: string, notification: NotificationData): void {
        if (this.io) {
            this.io.to(`user_${recipientId}`).emit('notification', notification);
            console.log(`Generic notification (${notification.type}) sent to user ${recipientId}`);
        }
    }


    // sendNotification(recipientId: string, type: string, data: any): void {
    //     if (io) {
    //         io.to(`user_${recipientId}`).emit('notification', { type, data, timestamp: new Date().toISOString() });
    //         console.log(`Generic notification (${type}) sent to user ${recipientId}`);
    //     }
    // }
    
    sendNotificationToUsers(userIds: string[], type: string, data: any): void {
        if (this.io) {
            userIds.forEach(userId => {
                this.io.to(`user_${userId}`).emit('notification', { type, data, timestamp: new Date().toISOString() });
            });
            console.log(`Notification (${type}) sent to ${userIds.length} users`);
        }
    }
    
    isUserConnected(userId: string): boolean {
        if (this.io) {
            const room = this.io.sockets.adapter.rooms.get(`user_${userId}`);
            return room ? room.size > 0 : false;
        }
        return false;
    }
    
    getConnectedUsersCount(): number {
        if (this.io) {
            return this.io.engine.clientsCount;
        }
        return 0;
    }
    
    getConnectedUserIds(): string[] {
        if (this.io) {
            const connectedUsers: string[] = [];
            this.io.sockets.adapter.rooms.forEach((room, roomName) => {
                if (roomName.startsWith('user_')) {
                    const userId = roomName.replace('user_', '');
                    if (room.size > 0) {
                        connectedUsers.push(userId);
                    }
                }
            });
            return connectedUsers;
        }
        return [];
    }
    
    sendNotificationCount(userId: string, count: number): void {
        if (this.io) {
            this.io.to(`user_${userId}`).emit('notification_count', { count, timestamp: new Date().toISOString() });
            console.log(`Notification count (${count}) sent to user ${userId}`);
        }
    }

    broadcast(type: string, data: any): void {
        if (this.io) {
            this.io.emit('broadcast', { type, data, timestamp: new Date().toISOString() });
            console.log(`Broadcast message (${type}) sent to all users`);
        }
    }
}
