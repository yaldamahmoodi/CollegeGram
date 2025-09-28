# WebSocket Notifications - Frontend Implementation Guide

## Overview

This guide shows you how to implement real-time WebSocket notifications in your React frontend to receive notifications when users like, comment, mention, or follow you.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd apps/web
npm install socket.io-client
```

### 2. WebSocket Service

Create `src/services/websocket.service.ts`:

```typescript
import { io, Socket } from 'socket.io-client';

// Notification types that match backend
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

class WebSocketService {
    private socket: Socket | null = null;

    connect(token: string) {
        this.socket = io('http://localhost:3001', {
            auth: { token }
        });

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });
    }

    disconnect() {
        this.socket?.disconnect();
        this.socket = null;
    }

    // Listen for different notification types
    onLikeNotification(callback: (notification: LikeNotification) => void) {
        this.socket?.on('like_notification', callback);
    }

    onCommentNotification(callback: (notification: CommentNotification) => void) {
        this.socket?.on('comment_notification', callback);
    }

    onMentionNotification(callback: (notification: MentionNotification) => void) {
        this.socket?.on('mention_notification', callback);
    }

    onFollowNotification(callback: (notification: FollowNotification) => void) {
        this.socket?.on('follow_notification', callback);
    }

    // Remove listeners
    offLikeNotification(callback: (notification: LikeNotification) => void) {
        this.socket?.off('like_notification', callback);
    }

    offCommentNotification(callback: (notification: CommentNotification) => void) {
        this.socket?.off('comment_notification', callback);
    }

    offMentionNotification(callback: (notification: MentionNotification) => void) {
        this.socket?.off('mention_notification', callback);
    }

    offFollowNotification(callback: (notification: FollowNotification) => void) {
        this.socket?.off('follow_notification', callback);
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

export const websocketService = new WebSocketService();
```

### 3. React Hook

Create `src/hooks/useNotifications.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { 
    websocketService, 
    LikeNotification, 
    CommentNotification, 
    MentionNotification, 
    FollowNotification 
} from '../services/websocket.service';

export type NotificationData = LikeNotification | CommentNotification | MentionNotification | FollowNotification;

export const useNotifications = (token?: string) => {
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    useEffect(() => {
        if (!token) return;

        // Connect to WebSocket
        websocketService.connect(token);
        setIsConnected(websocketService.isConnected());

        // Notification handlers
        const handleLike = (notification: LikeNotification) => {
            setNotifications(prev => [notification, ...prev]);
        };

        const handleComment = (notification: CommentNotification) => {
            setNotifications(prev => [notification, ...prev]);
        };

        const handleMention = (notification: MentionNotification) => {
            setNotifications(prev => [notification, ...prev]);
        };

        const handleFollow = (notification: FollowNotification) => {
            setNotifications(prev => [notification, ...prev]);
        };

        // Add listeners
        websocketService.onLikeNotification(handleLike);
        websocketService.onCommentNotification(handleComment);
        websocketService.onMentionNotification(handleMention);
        websocketService.onFollowNotification(handleFollow);

        // Cleanup
        return () => {
            websocketService.offLikeNotification(handleLike);
            websocketService.offCommentNotification(handleComment);
            websocketService.offMentionNotification(handleMention);
            websocketService.offFollowNotification(handleFollow);
            websocketService.disconnect();
            setIsConnected(false);
        };
    }, [token]);

    const removeNotification = useCallback((timestamp: string) => {
        setNotifications(prev => prev.filter(notif => notif.timestamp !== timestamp));
    }, []);

    return {
        isConnected,
        notifications,
        removeNotification
    };
};
```

### 4. Notification Toast Component

Create `src/components/NotificationToast.tsx`:

```typescript
import React, { useEffect } from 'react';
import { NotificationData } from '../hooks/useNotifications';

interface NotificationToastProps {
    notification: NotificationData;
    onRemove: (timestamp: string) => void;
    onNavigate?: (notification: NotificationData) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ 
    notification, 
    onRemove, 
    onNavigate 
}) => {
    useEffect(() => {
        // Auto remove after 5 seconds
        const timer = setTimeout(() => {
            onRemove(notification.timestamp);
        }, 5000);

        return () => clearTimeout(timer);
    }, [notification.timestamp, onRemove]);

    const getNotificationContent = () => {
        switch (notification.type) {
            case 'like':
                return {
                    icon: '❤️',
                    message: `${notification.senderUsername} liked your post`,
                    bgColor: 'bg-red-50 border-red-200',
                    iconBg: 'bg-red-100'
                };
            case 'comment':
                return {
                    icon: '💬',
                    message: `${notification.senderUsername} commented on your post`,
                    bgColor: 'bg-blue-50 border-blue-200',
                    iconBg: 'bg-blue-100'
                };
            case 'mention':
                return {
                    icon: '📢',
                    message: `${notification.senderUsername} mentioned you`,
                    bgColor: 'bg-yellow-50 border-yellow-200',
                    iconBg: 'bg-yellow-100'
                };
            case 'follow':
                return {
                    icon: '👤',
                    message: `${notification.senderUsername} started following you`,
                    bgColor: 'bg-green-50 border-green-200',
                    iconBg: 'bg-green-100'
                };
        }
    };

    const content = getNotificationContent();

    const handleClick = () => {
        onNavigate?.(notification);
        onRemove(notification.timestamp);
    };

    return (
        <div 
            className={`
                ${content.bgColor} border rounded-lg shadow-lg p-4 max-w-sm 
                cursor-pointer hover:shadow-xl transition-all duration-300 
                transform hover:scale-105
            `}
            onClick={handleClick}
        >
            <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-10 h-10 ${content.iconBg} rounded-full flex items-center justify-center`}>
                    <span className="text-lg">{content.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                        {content.message}
                    </p>
                    <p className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(notification.timestamp);
                    }}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default NotificationToast;
```

### 5. Notification Container

Create `src/components/NotificationContainer.tsx`:

```typescript
import React from 'react';
import { useNotifications, NotificationData } from '../hooks/useNotifications';
import NotificationToast from './NotificationToast';
import { useNavigate } from 'react-router-dom';

interface NotificationContainerProps {
    token?: string;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ token }) => {
    const { notifications, removeNotification } = useNotifications(token);
    const navigate = useNavigate();

    const handleNavigate = (notification: NotificationData) => {
        switch (notification.type) {
            case 'like':
            case 'comment':
            case 'mention':
                navigate(`/post/${notification.postId}`);
                break;
            case 'follow':
                navigate(`/profile/${notification.senderUsername}`);
                break;
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification, index) => (
                <div
                    key={notification.timestamp}
                    style={{
                        transform: `translateY(${index * 10}px)`,
                        zIndex: 50 - index,
                        transition: 'transform 0.3s ease-in-out'
                    }}
                >
                    <NotificationToast
                        notification={notification}
                        onRemove={removeNotification}
                        onNavigate={handleNavigate}
                    />
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;
```

### 6. Usage in App Component

Add to your main `App.tsx`:

```typescript
import NotificationContainer from './components/NotificationContainer';

function App() {
    const token = localStorage.getItem('accessToken'); // Or however you store tokens

    return (
        <div className="App">
            {/* Your existing components */}
            <Routes>
                {/* Your routes */}
            </Routes>
            
            {/* Add notification container */}
            <NotificationContainer token={token} />
        </div>
    );
}
```

## 📱 Optional: Connection Status Indicator

Create `src/components/ConnectionStatus.tsx`:

```typescript
import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

const ConnectionStatus: React.FC<{ token?: string }> = ({ token }) => {
    const { isConnected } = useNotifications(token);

    return (
        <div className="fixed bottom-4 left-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                isConnected 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
            }`}>
                <div className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
        </div>
    );
};

export default ConnectionStatus;
```

## 🎯 Usage Examples

### Show notification count in header:

```typescript
import { useNotifications } from '../hooks/useNotifications';

const Header = () => {
    const { notifications } = useNotifications(userToken);

    return (
        <div className="header">
            <div className="notification-badge">
                {notifications.length > 0 && (
                    <span className="badge">{notifications.length}</span>
                )}
                🔔
            </div>
        </div>
    );
};
```

### Display recent notifications in a dropdown:

```typescript
const NotificationDropdown = () => {
    const { notifications } = useNotifications(userToken);

    return (
        <div className="dropdown">
            <h3>Recent Notifications</h3>
            {notifications.slice(0, 5).map(notification => (
                <div key={notification.timestamp} className="notification-item">
                    {notification.senderUsername} {notification.type}d your content
                </div>
            ))}
        </div>
    );
};
```

## 🔧 Backend Events Reference

Your backend sends these WebSocket events:

| Event | Trigger | Data |
|-------|---------|------|
| `like_notification` | Someone likes your post | `{ type, postId, senderUsername, senderId, timestamp }` |
| `comment_notification` | Someone comments on your post | `{ type, postId, commentId, senderUsername, senderId, timestamp }` |
| `mention_notification` | Someone mentions you | `{ type, postId, senderUsername, senderId, timestamp }` |
| `follow_notification` | Someone follows you | `{ type, senderUsername, senderId, timestamp }` |

## 🎨 Customization

### Change notification styles:

```typescript
// In NotificationToast.tsx, modify the getNotificationContent function:
const getNotificationContent = () => {
    switch (notification.type) {
        case 'like':
            return {
                icon: '❤️',
                message: `${notification.senderUsername} liked your post`,
                bgColor: 'bg-red-50 border-red-200', // Change colors here
                iconBg: 'bg-red-100'
            };
        // ... other cases
    }
};
```

### Change auto-dismiss time:

```typescript
// In NotificationToast.tsx, change the timeout:
useEffect(() => {
    const timer = setTimeout(() => {
        onRemove(notification.timestamp);
    }, 10000); // Change from 5000 to 10000 for 10 seconds

    return () => clearTimeout(timer);
}, [notification.timestamp, onRemove]);
```

### Add sound notifications:

```typescript
// In useNotifications hook:
const handleLike = (notification: LikeNotification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Play sound
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(console.error);
};
```

## 🔍 Troubleshooting

### Connection issues:
1. Check if the backend server is running
2. Verify the WebSocket URL is correct
3. Make sure the JWT token is valid
4. Check browser console for errors

### Notifications not appearing:
1. Verify the token is being passed to the hook
2. Check if the user has the tab open (WebSocket only works when active)
3. Test with browser dev tools Network tab

### Styling issues:
1. Make sure Tailwind CSS is configured
2. Check that the notification container has proper z-index
3. Verify the container is not being hidden by other elements

## ✅ Testing

### Test notifications manually:
1. Open your app in two different browser windows
2. Login as different users in each window
3. Have one user like/comment on the other user's post
4. Check if notification appears in real-time

### Browser console commands for testing:
```javascript
// Check WebSocket connection
console.log(websocketService.isConnected());

// Manually trigger a test notification (if you add this to your service)
websocketService.socket.emit('test', { message: 'Hello' });
```

## 🚀 Production Setup

### Environment variables:
```env
# In your .env file
VITE_API_URL=https://your-production-api.com
```

### Update WebSocket service:
```typescript
// Use environment variable instead of hardcoded URL
this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
    auth: { token }
});
```

---

## 🎉 You're Done!

After implementing these files, you'll have:

- ✅ Real-time notifications when someone likes your posts
- ✅ Real-time notifications for comments and replies  
- ✅ Real-time notifications for mentions
- ✅ Real-time notifications for new followers
- ✅ Beautiful toast notifications with navigation
- ✅ Auto-dismiss functionality
- ✅ Connection status monitoring

The notifications will appear in the top-right corner and automatically disappear after 5 seconds, or users can click them to navigate to the relevant content!
