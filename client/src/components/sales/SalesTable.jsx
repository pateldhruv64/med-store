import { useEffect, useState } from 'react';
import * as salesApi from '../../api/sales';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../utils/format';

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function SalesTable() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState(getToday());
  const [to, setTo] = useState(getToday());
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await salesApi.getAll(params);
      setSales(res.data);
    } catch {
      addNotification('Failed to fetch sales', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [from, to]);

  const filtered = sales.filter(s =>
    (s.medicine?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.staff?.username || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = filtered.reduce((sum, s) => sum + (s.quantity * s.price), 0);
  const totalProfit = filtered.reduce((sum, s) => sum + ((s.price - (s.medicine?.purchasePrice || 0)) * s.quantity), 0);

  const tableClass =
    'mx-auto w-full max-w-2xl text-xs md:text-sm border-separate border-spacing-0';
  const thClass =
    'px-3 py-2 text-left font-bold bg-gray-100 text-gray-700 border-b border-gray-200';
  const tdClass =
    'px-3 py-2 border-b border-gray-100 align-middle';
  const tdRight = tdClass + ' text-right';
  const tdDate = tdClass + ' text-right text-gray-500';

  return (
    <div className="bg-white rounded-xl shadow p-2 md:p-4 mt-4 overflow-x-auto w-full max-w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 max-w-2xl mx-auto gap-2">
        <div className="flex gap-2 items-center">
          <label className="text-xs font-semibold">From:</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border p-1 rounded text-xs" />
          <label className="text-xs font-semibold">To:</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border p-1 rounded text-xs" />
          {(from || to) && <button className="ml-2 text-xs text-blue-600 underline" onClick={() => { setFrom(''); setTo(''); }}>Clear</button>}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="border p-2 rounded w-64 text-sm" />
      </div>
      {loading ? <div className="text-center py-4">Loading...</div> : (
        <table className={tableClass + ' min-w-full'}>
          <thead>
            <tr>
              <th className={thClass}>Medicine</th>
              <th className={thClass + ' text-right'}>Quantity</th>
              <th className={thClass + ' text-right'}>Price</th>
              <th className={thClass + ' text-right'}>Total</th>
              <th className={thClass + ' text-right'}>Profit</th>
              <th className={thClass + ' text-right'}>Date</th>
              <th className={thClass + ' text-left'}>Staff</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s._id} className={i % 2 ? 'bg-gray-50' : ''}>
                <td className={tdClass + ' font-medium'}>{s.medicine?.name}</td>
                <td className={tdRight}>{s.quantity}</td>
                <td className={tdRight}>₹{s.price}</td>
                <td className={tdRight + ' font-semibold'}>₹{s.quantity * s.price}</td>
                <td className={tdRight + ' font-semibold ' + (((s.price - (s.medicine?.purchasePrice || 0)) * s.quantity) < 0 ? 'text-red-600' : 'text-green-700')}>
                  ₹{(s.price - (s.medicine?.purchasePrice || 0)) * s.quantity}
                </td>
                <td className={tdDate}>{formatDate(s.date)}</td>
                <td className={tdClass}>{s.staff?.username}</td>
              </tr>
            ))}
            <tr>
              <td className={tdClass + ' font-bold text-right'} colSpan={4}>Total</td>
              <td className={tdRight + ' font-bold ' + (totalProfit < 0 ? 'text-red-600' : 'text-green-700')}>
                ₹{totalProfit}
              </td>
              <td className={tdClass}></td>
              <td className={tdClass}></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
} 