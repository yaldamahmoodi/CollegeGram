import { useNotifications } from "@/hooks/notification.hook";

/**
 * Test component to verify notifications API response structure
 * Remove this file after testing
 */
const NotificationTest = () => {
  const { data, isLoading, error } = useNotifications({ page: 1, pageSize: 5 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notification API Test</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default NotificationTest;
