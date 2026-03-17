import { useEffect, useState } from 'react';
import * as reportsApi from '../../api/reports';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../utils/format';
import PdfExportButton from './PdfExportButton';

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function Reports() {
  const [stock, setStock] = useState([]);
  const [sales, setSales] = useState([]);
  const [expiry, setExpiry] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(getToday());
  const [to, setTo] = useState(getToday());
  const { addNotification } = useNotification();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      reportsApi.stock(),
      reportsApi.sales({ from, to }),
      reportsApi.expiry(),
      reportsApi.lowStock(),
    ]).then(([s, sa, e, l]) => {
      setStock(s.data);
      setSales(sa.data);
      setExpiry(e.data);
      setLowStock(l.data);
    }).catch(() => addNotification('Failed to fetch reports', 'error'))
      .finally(() => setLoading(false));
  }, [from, to]);

  if (loading) return <div>Loading reports...</div>;

  const tableClass =
    'mx-auto w-full max-w-2xl text-xs md:text-sm border-separate border-spacing-0';
  const thClass =
    'px-3 py-2 text-left font-bold bg-gray-100 text-gray-700 border-b border-gray-200';
  const tdClass =
    'px-3 py-2 border-b border-gray-100 align-middle';
  const tdRight = tdClass + ' text-right';
  const tdDate = tdClass + ' text-right text-gray-500';

  return (
    <div className="space-y-8">
      {/* Stock Report */}
      <div>
        <h3 className="font-semibold mb-2 text-lg">Stock Report</h3>
        <div className="bg-white rounded-xl shadow p-2 md:p-4 overflow-x-auto w-full max-w-full">
          <table className={tableClass + ' min-w-full'}>
            <thead>
              <tr>
                <th className={thClass}>Name</th>
                <th className={thClass + ' text-right'}>Qty</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((s, i) => (
                <tr key={s._id} className={i % 2 ? 'bg-gray-50' : ''}>
                  <td className={tdClass + ' font-medium'}>{s.name}</td>
                  <td className={tdRight}>{s.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Sales Report */}
      <div>
        <h3 className="font-semibold mb-2 text-lg">Sales Report</h3>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 max-w-2xl mx-auto gap-2">
          <div className="flex gap-2 items-center">
            <label className="text-xs font-semibold">From:</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border p-1 rounded text-xs" />
            <label className="text-xs font-semibold">To:</label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border p-1 rounded text-xs" />
            {(from || to) && <button className="ml-2 text-xs text-blue-600 underline" onClick={() => { setFrom(''); setTo(''); }}>Clear</button>}
          </div>
        </div>
        <div className="flex gap-4 justify-center mt-2">
          <PdfExportButton from={from} to={to} />
          <PdfExportButton from={from} to={to} type="full" />
        </div>
        <div className="bg-white rounded-xl shadow p-2 md:p-4 overflow-x-auto w-full max-w-full">
          <table className={tableClass + ' min-w-full'}>
            <thead>
              <tr>
                <th className={thClass}>Medicine</th>
                <th className={thClass + ' text-right'}>Qty</th>
                <th className={thClass + ' text-right'}>Price</th>
                <th className={thClass + ' text-right'}>Total</th>
                <th className={thClass + ' text-right'}>Profit</th>
                <th className={thClass + ' text-right'}>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s, i) => {
                const profit = (s.price - (s.medicine?.purchasePrice || 0)) * s.quantity;
                return (
                  <tr key={s._id} className={i % 2 ? 'bg-gray-50' : ''}>
                    <td className={tdClass + ' font-medium'}>{s.medicine?.name}</td>
                    <td className={tdRight}>{s.quantity}</td>
                    <td className={tdRight}>₹{s.price}</td>
                    <td className={tdRight}>₹{s.quantity * s.price}</td>
                    <td className={tdRight}>₹{profit}</td>
                    <td className={tdDate}>{formatDate(s.date)}</td>
                  </tr>
                );
              })}
              {/* Total profit row */}
              <tr>
                <td className={tdClass + ' font-bold text-right'} colSpan={4}>Total Profit</td>
                <td className={tdRight + ' font-bold text-green-700'}>
                  ₹{sales.reduce((sum, s) => sum + ((s.price - (s.medicine?.purchasePrice || 0)) * s.quantity), 0)}
                </td>
                <td className={tdClass}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Expiry Report */}
      <div>
        <h3 className="font-semibold mb-2 text-lg">Expiry Report</h3>
        <div className="bg-white rounded-xl shadow p-2 md:p-4 overflow-x-auto w-full max-w-full">
          <table className={tableClass + ' min-w-full'}>
            <thead>
              <tr>
                <th className={thClass}>Name</th>
                <th className={thClass + ' text-right'}>Expiry</th>
              </tr>
            </thead>
            <tbody>
              {expiry.map((e, i) => (
                <tr key={e._id} className={i % 2 ? 'bg-gray-50' : ''}>
                  <td className={tdClass + ' font-medium'}>{e.name}</td>
                  <td className={tdDate}>{formatDate(e.expiry)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Low Stock Report */}
      <div>
        <h3 className="font-semibold mb-2 text-lg">Low Stock Report</h3>
        <div className="bg-white rounded-xl shadow p-2 md:p-4 overflow-x-auto w-full max-w-full">
          <table className={tableClass + ' min-w-full'}>
            <thead>
              <tr>
                <th className={thClass}>Name</th>
                <th className={thClass + ' text-right'}>Qty</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((l, i) => (
                <tr key={l._id} className={i % 2 ? 'bg-gray-50' : ''}>
                  <td className={tdClass + ' font-medium'}>{l.name}</td>
                  <td className={tdRight}>{l.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 