// components/dashboard/StaffDashboard.jsx
// TODO: Implement StaffDashboard component 
import { useEffect, useState } from 'react';
import * as salesApi from '../../api/sales';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StaffDashboard() {
  const [stats, setStats] = useState({ totalSales: 0, totalProfit: 0, profitByDate: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    salesApi.myStats()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  const profitChartData = {
    labels: Object.keys(stats.profitByDate),
    datasets: [
      {
        label: 'Profit by Date',
        data: Object.values(stats.profitByDate),
        backgroundColor: 'rgba(16,185,129,0.6)',
      },
    ],
  };

  if (loading) return <div>Loading stats...</div>;

  return (
    <div className="bg-white rounded shadow p-2 sm:p-6 mb-4 w-full max-w-full">
      <h2 className="text-lg font-semibold mb-4">Staff Quick Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-green-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{stats.totalSales}</div>
          <div className="text-gray-600 text-sm">Your Sales</div>
        </div>
        <div className="bg-green-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">₹{stats.totalProfit}</div>
          <div className="text-gray-600 text-sm">Total Profit</div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center w-full h-64 mt-6">
        <div className="font-semibold mb-2">Profit by Date</div>
        <Bar data={profitChartData} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }} className="w-full h-full" />
      </div>
    </div>
  );
} 