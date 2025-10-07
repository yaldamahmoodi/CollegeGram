# Notifications Page

## Overview
This directory contains the notifications page components for the application.

## Components

### `Notifications.tsx`
The main notifications page with:
- Tab-based filtering by notification type (All, Like, Comment, Mention, Follow, Reply, Save)
- Pagination support
- Mark all as read functionality
- RTL (Persian) layout support

### `NotificationItem.tsx`
Individual notification component with:
- Type-specific icons and colors
- Time ago display
- Click to navigate to related content
- Mark as read / Delete actions
- Visual indicator for unread notifications (orange left border)

## Usage

```typescript
import Notifications from '@/pages/notifications';

// In your route:
<Route path="notifications" element={<Notifications />} />
```

## Features

### Notification Types
- **Like** (❤️) - Red theme
- **Comment** (💬) - Blue theme
- **Mention** (📢) - Yellow theme
- **Follow** (👤) - Green theme
- **Save** (💾) - Purple theme
- **Reply** (↩️) - Orange theme

### Actions
- Click notification to navigate to related post/profile
- Mark individual notification as read
- Delete individual notification
- Mark all notifications as read (header button)

### States
- Loading skeleton
- Empty state
- Error state with retry button

### Pagination
- 20 notifications per page
- Previous/Next navigation
- Current page indicator

## Data Flow

1. Page fetches notifications using `useNotifications` hook
2. Notifications are filtered by selected tab
3. Real-time updates via WebSocket invalidate queries
4. Actions (mark as read, delete) trigger cache invalidation
5. UI updates automatically via Tanstack Query

## Styling

All components use:
- Tailwind CSS for styling
- RTL direction for Persian text
- Responsive design
- Hover effects and transitions
- Color-coded notification types

