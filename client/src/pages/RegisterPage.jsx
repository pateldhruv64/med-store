import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'staff',
    securityKey: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(''); // Clear error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    const res = await register(
      form.username,
      form.password,
      form.role,
      form.securityKey,
    );
    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-xs min-w-0 px-2 sm:px-4 space-y-4"
      >
        <h2 className="text-2xl font-bold mb-2">Register</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm">
            Registration successful! Redirecting...
          </div>
        )}
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          disabled={success}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          disabled={success}
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          disabled={success}
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <input
          name="securityKey"
          placeholder="Security Key"
          value={form.securityKey}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          disabled={success}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={success}
        >
          Register
        </button>
        <div className="text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
