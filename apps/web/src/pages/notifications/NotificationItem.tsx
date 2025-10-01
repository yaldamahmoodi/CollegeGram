import { useNavigate } from "react-router-dom";
import type { Notification } from "@app-types/notification";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) => {
  const navigate = useNavigate();

  const getNotificationContent = () => {
    const { type, data } = notification;

    switch (type) {
      case "like":
        return {
          icon: "❤️",
          message: `${data.senderUsername} پست شما را لایک کرد`,
          bgColor: notification.isRead ? "bg-white" : "bg-red-50",
        };
      case "comment":
        return {
          icon: "💬",
          message: `${data.senderUsername} روی پست شما کامنت گذاشت`,
          bgColor: notification.isRead ? "bg-white" : "bg-blue-50",
        };
      case "mention":
        return {
          icon: "📢",
          message: `${data.senderUsername} شما را منشن کرد`,
          bgColor: notification.isRead ? "bg-white" : "bg-yellow-50",
        };
      case "follow":
        return {
          icon: "👤",
          message: `${data.senderUsername} شما را دنبال کرد`,
          bgColor: notification.isRead ? "bg-white" : "bg-green-50",
        };
      case "save":
        return {
          icon: "💾",
          message: `${data.senderUsername} پست شما را ذخیره کرد`,
          bgColor: notification.isRead ? "bg-white" : "bg-purple-50",
        };
      case "reply":
        return {
          icon: "↩️",
          message: `${data.senderUsername} به کامنت شما پاسخ داد`,
          bgColor: notification.isRead ? "bg-white" : "bg-orange-50",
        };
      default:
        return {
          icon: "🔔",
          message: "اعلان جدید",
          bgColor: notification.isRead ? "bg-white" : "bg-gray-50",
        };
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }

    // Navigate based on notification type
    if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    } else if (notification.type === "follow") {
      navigate(`/profile/${notification.data.senderUsername}`);
    }
  };

  const content = getNotificationContent();

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return "همین الان";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} دقیقه پیش`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ساعت پیش`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} روز پیش`;
    return `${Math.floor(seconds / 604800)} هفته پیش`;
  };

  return (
    <div
      className={`
        ${content.bgColor} 
        border border-gray-200 rounded-lg p-4 
        cursor-pointer hover:shadow-md transition-all
        ${!notification.isRead ? "border-l-4 border-l-orange-500" : ""}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
            {content.icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 mb-1">
            {content.message}
          </p>

          {notification.data.commentContent && (
            <p className="text-xs text-gray-600 mb-1 truncate">
              {notification.data.commentContent}
            </p>
          )}

          <p className="text-xs text-gray-500">
            {timeAgo(notification.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!notification.isRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification._id);
              }}
              className="text-xs text-blue-500 hover:text-blue-600 px-2 py-1 rounded"
              title="علامت‌گذاری به عنوان خوانده شده"
            >
              خواندن
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification._id);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="حذف"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

