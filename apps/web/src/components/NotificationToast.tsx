import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "@/hooks/useNotificationStore";

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotificationStore();
  const navigate = useNavigate();

  const handleToastClick = (notification: { id: string; postId?: string; type: string; senderUsername: string }) => {
    // Navigate based on notification type
    if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    } else if (notification.type === 'follow') {
      navigate(`/profile/${notification.senderUsername}`);
    }
    
    removeNotification(notification.id);
  };

  const getNotificationContent = (notification: { type: string; senderUsername: string }) => {
    switch (notification.type) {
      case 'like':
        return {
          icon: '❤️',
          message: `${notification.senderUsername} پست شما را لایک کرد`,
          bgColor: 'bg-red-50 border-red-200',
          iconBg: 'bg-red-100'
        };
      case 'comment':
        return {
          icon: '💬',
          message: `${notification.senderUsername} روی پست شما کامنت گذاشت`,
          bgColor: 'bg-blue-50 border-blue-200',
          iconBg: 'bg-blue-100'
        };
      case 'mention':
        return {
          icon: '📢',
          message: `${notification.senderUsername} شما را منشن کرد`,
          bgColor: 'bg-yellow-50 border-yellow-200',
          iconBg: 'bg-yellow-100'
        };
      case 'follow':
        return {
          icon: '👤',
          message: `${notification.senderUsername} شما را دنبال کرد`,
          bgColor: 'bg-green-50 border-green-200',
          iconBg: 'bg-green-100'
        };
      case 'save':
        return {
          icon: '💾',
          message: `${notification.senderUsername} پست شما را ذخیره کرد`,
          bgColor: 'bg-purple-50 border-purple-200',
          iconBg: 'bg-purple-100'
        };
      case 'reply':
        return {
          icon: '↩️',
          message: `${notification.senderUsername} به کامنت شما پاسخ داد`,
          bgColor: 'bg-orange-50 border-orange-200',
          iconBg: 'bg-orange-100'
        };
      default:
        return {
          icon: '🔔',
          message: 'اعلان جدید',
          bgColor: 'bg-gray-50 border-gray-200',
          iconBg: 'bg-gray-100'
        };
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div className="fixed top-4 right-4 z-50 space-y-2" dir="rtl">
      {notifications.map((notification, index) => {
        const content = getNotificationContent(notification);
        
        return (
          <div
            key={notification.id}
            className="
              bg-white border-l-4 border-blue-500 rounded-lg shadow-xl p-4 max-w-sm
              cursor-pointer hover:shadow-2xl transition-all duration-300 
              transform hover:scale-105 backdrop-blur-sm
            "
            style={{
              transform: `translateY(${index * 8}px)`,
              zIndex: 50 - index,
              animation: `slideInRight 0.3s ease-out ${index * 0.1}s both`,
            }}
            onClick={() => handleToastClick(notification)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-2 border-blue-300">
                <span className="text-lg">{content.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {content.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.timestamp).toLocaleTimeString('fa-IR')}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
      </div>
    </>
  );
};

export default NotificationToast;
