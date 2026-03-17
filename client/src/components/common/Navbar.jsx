import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  return (
    <nav className="flex items-center justify-between bg-white shadow px-4 py-3 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        {/* Hamburger menu for mobile */}
        <button className="md:hidden p-2 focus:outline-none" onClick={onMenuClick} aria-label="Open sidebar">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-xl text-blue-700">Pharmacy Inventory</span>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-gray-700">{user.name} ({user.role})</span>
            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
} 