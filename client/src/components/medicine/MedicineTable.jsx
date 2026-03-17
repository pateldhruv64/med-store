import { useEffect, useState } from 'react';
import * as medApi from '../../api/medicines';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../utils/format';

export default function MedicineTable({ onEdit }) {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addStockId, setAddStockId] = useState(null);
  const [addQty, setAddQty] = useState('');
  const { addNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await medApi.getAll(search);
      setMedicines(res.data);
    } catch (err) {
      setError('Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this medicine?')) return;
    try {
      await medApi.remove(id);
      addNotification('Medicine deleted', 'success');
      fetchData();
    } catch {
      addNotification('Delete failed', 'error');
    }
  };

  const handleAddStock = async (id) => {
    if (!addQty || isNaN(addQty) || Number(addQty) <= 0) {
      addNotification('Enter a valid quantity', 'error');
      return;
    }
    try {
      await medApi.addStock(id, Number(addQty));
      addNotification('Stock added', 'success');
      setAddStockId(null);
      setAddQty('');
      fetchData();
    } catch {
      addNotification('Add stock failed', 'error');
    }
  };

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
      <div className="flex justify-between mb-2 max-w-2xl mx-auto">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="border p-2 rounded w-64 text-sm" />
      </div>
      {loading ? <div className="text-center py-4">Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
        <table className={tableClass + ' min-w-full'}>
          <thead>
            <tr>
              <th className={thClass}>Name</th>
              <th className={thClass}>Brand</th>
              <th className={thClass}>Batch</th>
              <th className={thClass + ' text-right'}>Expiry</th>
              <th className={thClass + ' text-right'}>Qty</th>
              <th className={thClass + ' text-right'}>Purchase Price</th>
              <th className={thClass + ' text-center'}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m, i) => (
              <tr key={m._id} className={i % 2 ? 'bg-gray-50' : ''}>
                <td className={tdClass + ' font-medium'}>{m.name}</td>
                <td className={tdClass}>{m.brand}</td>
                <td className={tdClass}>{m.batch}</td>
                <td className={tdDate}>{formatDate(m.expiry)}</td>
                <td className={tdRight}>{m.quantity}</td>
                <td className={tdRight}>₹{m.purchasePrice}</td>
                <td className={tdClass + ' text-center min-w-[120px]'}>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 items-center justify-center">
                    <button className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition text-xs sm:text-sm" onClick={() => onEdit && onEdit(m)}>Edit</button>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-xs sm:text-sm" onClick={() => { setAddStockId(m._id); setAddQty(''); }}>Add Stock</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-xs sm:text-sm" onClick={() => handleDelete(m._id)}>Delete</button>
                  </div>
                  {addStockId === m._id && (
                    <div className="mt-2 flex gap-2 items-center justify-center">
                      <input type="number" min="1" value={addQty} onChange={e => setAddQty(e.target.value)} placeholder="Qty" className="border p-1 rounded w-16 text-xs" />
                      <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs" onClick={() => handleAddStock(m._id)}>Add</button>
                      <button className="text-xs text-gray-500 underline" onClick={() => { setAddStockId(null); setAddQty(''); }}>Cancel</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 