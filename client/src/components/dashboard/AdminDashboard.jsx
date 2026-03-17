// components/dashboard/AdminDashboard.jsx
// TODO: Implement AdminDashboard component 

import { useEffect, useState } from 'react';
import * as medApi from '../../api/medicines';
import * as salesApi from '../../api/sales';
import { useNotification } from '../../context/NotificationContext';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // <-- Added Filler
} from 'chart.js';
import { formatDate } from '../../utils/format';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler); // <-- Register Filler

export default function AdminDashboard() {
  const [stats, setStats] = useState({ medicines: 0, sales: 0, lowStock: 0, expiring: 0 });
  const [medicines, setMedicines] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      medApi.getAll(),
      salesApi.getAll(),
      medApi.lowStockAlerts(),
      medApi.expiryAlerts(),
    ]).then(([meds, salesRes, low, exp]) => {
      setStats({
        medicines: meds.data.length,
        sales: salesRes.data.length,
        lowStock: low.data.length,
        expiring: exp.data.length,
      });
      setMedicines(meds.data);
      setSales(salesRes.data);
    }).catch(() => addNotification('Failed to fetch dashboard stats', 'error'))
      .finally(() => setLoading(false));
  }, []);

  // Chart: Medicines by Brand
  const brandCounts = medicines.reduce((acc, m) => {
    acc[m.brand] = (acc[m.brand] || 0) + 1;
    return acc;
  }, {});
  const brandChartData = {
    labels: Object.keys(brandCounts),
    datasets: [
      {
        label: 'Medicines by Brand',
        data: Object.values(brandCounts),
        backgroundColor: 'rgba(59,130,246,0.6)',
      },
    ],
  };

  // Chart: Sales by Date
  const salesByDate = sales.reduce((acc, s) => {
    const date = s.date?.slice(0, 10);
    acc[date] = (acc[date] || 0) + s.quantity;
    return acc;
  }, {});
  const salesChartData = {
    labels: Object.keys(salesByDate).map(formatDate),
    datasets: [
      {
        label: 'Sales (Qty) by Date',
        data: Object.values(salesByDate),
        borderColor: 'rgba(16,185,129,1)',
        backgroundColor: 'rgba(16,185,129,0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  if (loading) return <div>Loading stats...</div>;

  return (
    <div className="bg-white rounded shadow p-2 sm:p-6 mb-4 w-full max-w-full">
      <h2 className="text-lg font-semibold mb-4">Admin Quick Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{stats.medicines}</div>
          <div className="text-gray-600 text-sm">Total Medicines</div>
        </div>
        <div className="bg-blue-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{stats.sales}</div>
          <div className="text-gray-600 text-sm">Total Sales</div>
        </div>
        <div className="bg-blue-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{stats.lowStock}</div>
          <div className="text-gray-600 text-sm">Low Stock</div>
        </div>
        <div className="bg-blue-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{stats.expiring}</div>
          <div className="text-gray-600 text-sm">Expiring Soon</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center w-full h-64">
          <div className="font-semibold mb-2">Medicines by Brand</div>
          <Bar data={brandChartData} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }} className="w-full h-full" />
        </div>
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center w-full h-64">
          <div className="font-semibold mb-2">Sales (Qty) by Date</div>
          <Line data={salesChartData} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
} 