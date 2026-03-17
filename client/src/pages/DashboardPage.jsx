import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import StaffDashboard from '../components/dashboard/StaffDashboard';
import Alerts from '../components/medicine/Alerts';
import NotificationList from '../components/notifications/NotificationList';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="w-full min-w-0 px-2 sm:px-4 sm:max-w-2xl sm:mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <Alerts />
      {user?.role === 'admin' ? <AdminDashboard /> : <StaffDashboard />}
      <NotificationList />
    </div>
  );
} 