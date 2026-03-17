import { useState } from 'react';
import MedicineTable from '../components/medicine/MedicineTable';
import MedicineForm from '../components/medicine/MedicineForm';

export default function MedicinePage() {
  const [editMedicine, setEditMedicine] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const handleEdit = (med) => setEditMedicine(med);
  const handleSaved = () => {
    setEditMedicine(null);
    setRefresh((r) => r + 1);
  };

  return (
    <div className="w-full min-w-0 px-2 sm:px-4 sm:max-w-2xl sm:mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-2">Medicines</h1>
      <MedicineForm editMedicine={editMedicine} onSaved={handleSaved} />
      <MedicineTable key={refresh} onEdit={handleEdit} />
    </div>
  );
}
