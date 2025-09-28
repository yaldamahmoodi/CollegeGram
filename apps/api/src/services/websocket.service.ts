import { io } from '../server.ts';

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
    
    // Send like notification to a specific user
    static sendLikeNotification(recipientId: string, notification: LikeNotification): void {
        if (io) {
            io.to(`user_${recipientId}`).emit('like_notification', notification);
            console.log(`Like notification sent to user ${recipientId} from ${notification.senderUsername}`);
        }
    }
    
    // Send comment notification to a specific user
    static sendCommentNotification(recipientId: string, notification: CommentNotification): void {
        if (io) {
            io.to(`user_${recipientId}`).emit('comment_notification', notification);
            console.log(`Comment notification sent to user ${recipientId} from ${notification.senderUsername}`);
        }
    }
    
    // Send mention notification to a specific user
    static sendMentionNotification(recipientId: string, notification: MentionNotification): void {
        if (io) {
            io.to(`user_${recipientId}`).emit('mention_notification', notification);
            console.log(`Mention notification sent to user ${recipientId} from ${notification.senderUsername}`);
        }
    }
    
    // Send follow notification to a specific user
    static sendFollowNotification(recipientId: string, notification: FollowNotification): void {
        if (io) {
            io.to(`user_${recipientId}`).emit('follow_notification', notification);
            console.log(`Follow notification sent to user ${recipientId} from ${notification.senderUsername}`);
        }
    }
    
    // Send generic notification
    static sendNotification(recipientId: string, type: string, data: any): void {
        if (io) {
            io.to(`user_${recipientId}`).emit('notification', { type, data, timestamp: new Date().toISOString() });
            console.log(`Generic notification (${type}) sent to user ${recipientId}`);
        }
    }
    
    // Send notification to multiple users
    static sendNotificationToUsers(userIds: string[], type: string, data: any): void {
        if (io) {
            userIds.forEach(userId => {
                io.to(`user_${userId}`).emit('notification', { type, data, timestamp: new Date().toISOString() });
            });
            console.log(`Notification (${type}) sent to ${userIds.length} users`);
        }
    }
    
    // Check if a user is connected
    static isUserConnected(userId: string): boolean {
        if (io) {
            const room = io.sockets.adapter.rooms.get(`user_${userId}`);
            return room ? room.size > 0 : false;
        }
        return false;
    }
    
    // Get connected users count
    static getConnectedUsersCount(): number {
        if (io) {
            return io.engine.clientsCount;
        }
        return 0;
    }
    
    // Get all connected user IDs
    static getConnectedUserIds(): string[] {
        if (io) {
            const connectedUsers: string[] = [];
            io.sockets.adapter.rooms.forEach((room, roomName) => {
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
    
    // Send message to all connected users
    static broadcast(type: string, data: any): void {
        if (io) {
            io.emit('broadcast', { type, data, timestamp: new Date().toISOString() });
            console.log(`Broadcast message (${type}) sent to all users`);
        }
    }
}
