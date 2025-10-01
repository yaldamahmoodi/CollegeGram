import { useCallback, useLayoutEffect, useState } from "react";
import {
  useMyNotifications,
  useFriendsActivity,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/hooks/notification.hook";
import type {
  NotificationTabType,
  Notification,
} from "@app-types/notification";
import NotificationItem from "./NotificationItem";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<NotificationTabType>("myNotifs");
  const [page, setPage] = useState(1);

  const queryParams = {
    page,
    pageSize: 20,
  };

  // Use different hooks based on active tab
  const myNotificationsQuery = useMyNotifications(queryParams);
  const friendsActivityQuery = useFriendsActivity(queryParams);

  const { data, isLoading, error } =
    activeTab === "myNotifs" ? myNotificationsQuery : friendsActivityQuery;
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  const tabs: { key: NotificationTabType; label: string; icon: string }[] = [
    { key: "myNotifs", label: "اعلانات من", icon: "" },

    { key: "friendsActivity", label: "اعلانات دوستان من", icon: "" },
  ];

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };
  const [newNotification, setNewNotification] = useState<string[]>([]);

  const getNewNotification = useCallback(() => {
    data?.notifications?.forEach((notification: Notification) => {
      if (!notification.isRead) {
        setNewNotification((prev) => [...prev, notification._id]);
      }
    });
  }, [data]);

  console.log(newNotification);

  useLayoutEffect(() => {
    getNewNotification();
    markAllAsRead();
  }, [markAllAsRead, getNewNotification]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">خطا در دریافت اعلانات</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">اعلانات</h1>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto divide-x-2 divide-gray-300 gap-2 mb-6 pb-8 ">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className={`
              flex items-center gap-2 px-4  whitespace-nowrap transition-colors
              ${activeTab === tab.key ? " text-black  " : " text-gray-500 "}
            `}
          >
            <span>{tab.icon}</span>
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : data && data.notifications.length > 0 ? (
        <div className="space-y-8">
          {data.notifications.map((notification: Notification) => (
            <NotificationItem
              isNew={newNotification.includes(notification._id)}
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              imageLink={notification.senderId.ProfilePhoto?.path || ""}
            />
          ))}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                قبلی
              </button>
              <span className="text-sm text-gray-600">
                صفحه {page} از {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                بعدی
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <p className="text-gray-500">اعلانی وجود ندارد</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
