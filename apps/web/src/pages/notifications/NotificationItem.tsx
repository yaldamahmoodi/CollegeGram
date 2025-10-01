import type { Notification } from "@app-types/notification";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  isNew: boolean;
  imageLink: string;
}

const NotificationItem = ({
  isNew,
  notification,
  imageLink,
}: NotificationItemProps) => {
  const getNotificationContent = () => {
    const { type, data } = notification;

    switch (type) {
      case "like":
        return {
          icon: "❤️",
          message: `${data.senderUsername} پست شما را لایک کرد`,
        };
      case "comment":
        return {
          icon: "💬",
          message: `${data.senderUsername} روی پست شما کامنت گذاشت`,
        };
      case "mention":
        return {
          icon: "📢",
          message: `${data.senderUsername} شما را منشن کرد`,
        };
      case "follow":
        return {
          icon: "👤",
          message: `${data.senderUsername} شما را دنبال کرد`,
        };
      case "save":
        return {
          icon: "💾",
          message: `${data.senderUsername} پست شما را ذخیره کرد`,
        };
      case "reply":
        return {
          icon: "↩️",
          message: `${data.senderUsername} به کامنت شما پاسخ داد`,
        };
      default:
        return {
          icon: "🔔",
          message: "اعلان جدید",
        };
    }
  };

  const content = getNotificationContent();

  const timeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    if (seconds < 60) return "همین الان";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} دقیقه پیش`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ساعت پیش`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} روز پیش`;
    return `${Math.floor(seconds / 604800)} هفته پیش`;
  };

  return (
    <div
      className={`
        ${!notification.isRead || isNew ? "bg-[#E9E4FF] hover:shadow-md" : ""}
         rounded-full  
        cursor-pointer  transition-all
       
      `}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}

        <div className="w-18 h-18 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
          <img
            src={imageLink}
            alt={content.message}
            className="w-[4rem] h-[4rem] object-cover rounded-full"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-4">
          <p className="text-sm font-medium truncate text-gray-900 mb-1">
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
      </div>
    </div>
  );
};

export default NotificationItem;
