import { useState, useEffect } from 'react';
import * as salesApi from '../../api/sales';
import * as medApi from '../../api/medicines';
import { useNotification } from '../../context/NotificationContext';
import Select from 'react-select';

export default function SalesForm({ onSaved }) {
  const [form, setForm] = useState({ medicine: '', quantity: '', price: '' });
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    medApi.getAll().then(res => setMedicines(res.data));
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleMedicineChange = option => {
    setForm(f => ({ ...f, medicine: option ? option.value : '' }));
  };

  const total = (Number(form.quantity) || 0) * (Number(form.price) || 0);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await salesApi.create({ ...form, quantity: Number(form.quantity), price: Number(form.price) });
      addNotification('Sale added', 'success');
      setForm({ medicine: '', quantity: '', price: '' });
      if (onSaved) onSaved();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Sale failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const medicineOptions = medicines.map(m => ({
    value: m._id,
    label: `${m.name} (${m.brand})`,
  }));
  const selectedMedicine = medicineOptions.find(opt => opt.value === form.medicine) || null;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 mb-4 flex flex-col gap-4 w-full px-0 sm:px-4">
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex-1 min-w-[180px]">
          <Select
            options={medicineOptions}
            value={selectedMedicine}
            onChange={handleMedicineChange}
            placeholder="Select Medicine..."
            isClearable
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{ control: (base) => ({ ...base, minHeight: 44, borderRadius: 8, boxShadow: 'none', borderColor: '#d1d5db' }) }}
          />
        </div>
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="flex-1 border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition" required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="flex-1 border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition" required />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div></div>
        <div className="text-lg font-bold text-green-700">Total: ₹{total}</div>
      </div>
      <button className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold shadow hover:bg-green-700 transition disabled:opacity-60 mt-2" disabled={loading}>Add Sale</button>
    </form>
  );
} 