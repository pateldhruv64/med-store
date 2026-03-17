import { useEffect, useState } from 'react';
import * as notifApi from '../../api/notifications';
import { useNotification } from '../../context/NotificationContext';

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    notifApi.getAll()
      .then(res => setNotifications(res.data))
      .catch(() => addNotification('Failed to fetch notifications', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <h3 className="font-semibold mb-2">Notifications</h3>
      <ul className="space-y-1">
        {notifications.map(n => (
          <li key={n.id || n._id} className="text-gray-700">• {n.message}</li>
        ))}
      </ul>
    </div>
  );
} 