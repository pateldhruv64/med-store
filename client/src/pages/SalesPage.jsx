import { useState } from 'react';
import SalesForm from '../components/sales/SalesForm';
import SalesTable from '../components/sales/SalesTable';

export default function SalesPage() {
  const [refresh, setRefresh] = useState(0);
  const handleSaved = () => setRefresh(r => r + 1);
  return (
    <div className="w-full px-2 sm:px-4 sm:max-w-2xl sm:mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-2">Sales</h1>
      <SalesForm onSaved={handleSaved} />
      <SalesTable key={refresh} />
    </div>
  );
} 