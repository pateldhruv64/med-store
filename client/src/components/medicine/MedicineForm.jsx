import { useState, useEffect } from 'react';
import * as medApi from '../../api/medicines';
import { useNotification } from '../../context/NotificationContext';

export default function MedicineForm({ editMedicine, onSaved }) {
  const [form, setForm] = useState({
    name: '', brand: '', batch: '', expiry: '', quantity: '', purchasePrice: ''
  });
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (editMedicine) {
      setForm({
        name: editMedicine.name || '',
        brand: editMedicine.brand || '',
        batch: editMedicine.batch || '',
        expiry: editMedicine.expiry ? editMedicine.expiry.slice(0,10) : '',
        quantity: editMedicine.quantity || '',
        purchasePrice: editMedicine.purchasePrice || '',
      });
    } else {
      setForm({ name: '', brand: '', batch: '', expiry: '', quantity: '', purchasePrice: '' });
    }
  }, [editMedicine]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMedicine) {
        await medApi.update(editMedicine._id, form);
        addNotification('Medicine updated', 'success');
      } else {
        await medApi.create(form);
        addNotification('Medicine added', 'success');
      }
      setForm({ name: '', brand: '', batch: '', expiry: '', quantity: '', purchasePrice: '' });
      if (onSaved) onSaved();
    } catch {
      addNotification('Save failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded" required />
      <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} className="border p-2 rounded" required />
      <input name="batch" placeholder="Batch" value={form.batch} onChange={handleChange} className="border p-2 rounded" required />
      <input name="expiry" type="date" placeholder="Expiry" value={form.expiry} onChange={handleChange} className="border p-2 rounded" required />
      <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="border p-2 rounded" required />
      <input name="purchasePrice" type="number" placeholder="Purchase Price" value={form.purchasePrice} onChange={handleChange} className="border p-2 rounded" required />
      <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 col-span-1 md:col-span-3" disabled={loading}>{editMedicine ? 'Update' : 'Add'} Medicine</button>
    </form>
  );
} 