# 🔔 Notifications System Setup Guide

This guide explains the notifications system that has been set up in your web application.

## 📁 Files Created

### API Layer
- `src/api/notification/urls.ts` - API endpoint URLs
- `src/api/notification/notification.api.ts` - API functions for notifications

### Types
- `src/types/notification.ts` - TypeScript interfaces and types for notifications

### Hooks
- `src/hooks/notification.hook.ts` - Tanstack Query hooks for managing notifications
- `src/hooks/useWebSocket.hook.ts` - Hook for WebSocket connection management

### Services
- `src/services/serviceWorker.ts` - WebSocket service for real-time notifications

### Pages
- `src/pages/notifications/Notifications.tsx` - Main notifications page
- `src/pages/notifications/NotificationItem.tsx` - Individual notification component
- `src/pages/notifications/index.ts` - Export file

## 🚀 How to Use

### 1. Enable WebSocket Connection

Add the WebSocket hook to your main layout or app component:

```typescript
// In your ProfileLayout or main App component
import { useWebSocket } from "@/hooks/useWebSocket.hook";

function YourLayout() {
  const token = localStorage.getItem("token");
  const { isConnected } = useWebSocket(token);

  return (
    <div>
      {/* Your layout content */}
      {/* Optional: Show connection status */}
      {isConnected && <div className="text-green-500">🟢 Connected</div>}
    </div>
  );
}
```

### 2. Display Unread Count

Show notification count in your header or navigation:

```typescript
import { useUnreadCount } from "@/hooks/notification.hook";

function Header() {
  const { data: unreadCount } = useUnreadCount();

  return (
    <div className="header">
      <button onClick={() => navigate('/profile/notifications')}>
        🔔
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </button>
    </div>
  );
}
```

### 3. Navigate to Notifications Page

The notifications page is available at: `/profile/notifications`

## 📋 Features

### Notification Types
The system supports 6 types of notifications:
- ❤️ **Like** - When someone likes your post
- 💬 **Comment** - When someone comments on your post
- 📢 **Mention** - When someone mentions you
- 👤 **Follow** - When someone follows you
- ↩️ **Reply** - When someone replies to your comment
- 💾 **Save** - When someone saves your post

### Filtering
Users can filter notifications by type using the tabs at the top of the page.

### Actions
For each notification:
- Click to navigate to related content (post/profile)
- Mark as read
- Delete individual notification
- Mark all as read (button in header)

### Real-time Updates
- Notifications update in real-time via WebSocket
- Unread count updates automatically
- Query cache invalidates when new notifications arrive

## 🔧 Configuration

### Environment Variables
Add to your `.env` file:

```env
VITE_SOCKET_URL=http://localhost:3001
VITE_BASE_URL=http://localhost:3001/api/v1
```

For production:
```env
VITE_SOCKET_URL=https://your-production-api.com
VITE_BASE_URL=https://your-production-api.com/api/v1
```

## 🎨 Customization

### Styling
All components use Tailwind CSS and support RTL (right-to-left) layout. Modify styles in:
- `Notifications.tsx` - Main page styles
- `NotificationItem.tsx` - Individual notification styles

### Notification Messages
Edit the `getNotificationContent()` function in `NotificationItem.tsx` to customize:
- Icons
- Messages
- Colors
- Background colors

### Auto-refetch Interval
The unread count refetches every 30 seconds by default. Change in `notification.hook.ts`:

```typescript
export const useUnreadCount = () => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: getUnreadCount,
    select: (response) => response.data.unreadCount,
    refetchInterval: 60000, // Change to 60 seconds
  });
};
```

## 📡 API Endpoints Used

- `GET /notifications` - Get notifications (with pagination and filters)
- `GET /notifications/unread-count` - Get unread count
- `GET /notifications/:id` - Get single notification
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification
- `DELETE /notifications` - Delete all notifications

**API Response Structure:**
```json
{
  "code": "GET_NOTIFICATIONS_SUCCESSFULLY",
  "data": {
    "data": [...notifications],
    "totalCount": 0,
    "page": "1",
    "pageSize": "20",
    "totalPages": 0
  }
}
```

## 🐛 Troubleshooting

### WebSocket not connecting
1. Check if `VITE_SOCKET_URL` is set correctly
2. Verify backend WebSocket server is running
3. Check browser console for connection errors
4. Ensure token is valid

### Notifications not appearing
1. Check if the notifications route is added to `AppRoutes.tsx` ✅ (Already done)
2. Verify API endpoints are correct
3. Check network tab for API errors
4. Ensure authentication token is present

### Types not recognized
1. Make sure `@app-types` alias is configured in `tsconfig.json`
2. Restart TypeScript server in VS Code/WebStorm

## ✅ Installation Checklist

- [x] API files created
- [x] Types defined
- [x] Tanstack Query hooks implemented
- [x] WebSocket service configured
- [x] Notifications page created
- [x] Routes updated
- [x] socket.io-client installed
- [ ] Environment variables configured (needs to be done by you)
- [ ] WebSocket hook integrated in main layout (needs to be done by you)

## 🎯 Next Steps

1. Add the `useWebSocket` hook to your main layout component
2. Add notification count badge to your navigation
3. Configure environment variables for your environment
4. Test the notifications system
5. Customize styling to match your design

## 💡 Tips

- The notification page supports pagination (20 items per page)
- Notifications are sorted by creation date (newest first)
- Unread notifications have an orange left border
- The system works offline-first with Tanstack Query caching
- Real-time updates only work when WebSocket is connected

