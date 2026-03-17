import { useEffect, useState } from 'react';
import * as medApi from '../../api/medicines';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../utils/format';

export default function Alerts() {
  const [expiring, setExpiring] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    setLoading(true);
    Promise.all([medApi.expiryAlerts(), medApi.lowStockAlerts()])
      .then(([exp, low]) => {
        setExpiring(exp.data);
        setLowStock(low.data);
      })
      .catch(() => addNotification('Failed to fetch alerts', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading alerts...</div>;

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {expiring.map(m => (
        <div key={m._id} className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow text-yellow-800">
          <b>{m.name}</b> expiring on {formatDate(m.expiry)} ({Math.ceil((new Date(m.expiry) - new Date())/86400000)} days)
        </div>
      ))}
      {lowStock.map(m => (
        <div key={m._id} className="bg-red-100 border-l-4 border-red-500 p-4 rounded shadow text-red-800">
          <b>{m.name}</b> low stock: {m.quantity} left
        </div>
      ))}
    </div>
  );
} 