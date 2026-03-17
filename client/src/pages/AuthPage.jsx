import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await login(form.username, form.password);
    if (res.success) navigate('/');
    else setError(res.message || 'Login failed');
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-xs min-w-0 px-2 sm:px-4 space-y-4">
        <h2 className="text-2xl font-bold mb-2">Login</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border p-2 rounded" />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
        <div className="text-xs text-gray-500 mt-2">Don&apos;t have an account? <Link to="/register" className="text-blue-600 underline">Register</Link></div>
      </form>
    </div>
  );
} 