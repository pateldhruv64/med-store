import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Toast from './components/common/Toast';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MedicinePage from './pages/MedicinePage';
import SalesPage from './pages/SalesPage';
import ReportsPage from './pages/ReportsPage';
import NotFound from './pages/NotFound';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import { useState } from 'react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="flex min-h-screen w-full min-w-0 px-2 sm:px-0 bg-gray-50">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col">
              <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
              <main className="flex-1 p-4">
                <Routes>
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/medicines" element={<ProtectedRoute><MedicinePage /></ProtectedRoute>} />
                  <Route path="/sales" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Toast />
            </div>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
