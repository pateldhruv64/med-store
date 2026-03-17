// components/reports/PdfExportButton.jsx
// TODO: Implement PdfExportButton component 

import api from '../../api/axios';
import { useState } from 'react';

export default function PdfExportButton({ from, to, type = 'sales' }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const urlPath = type === 'full' ? '/reports/full-pdf' : '/reports/sales-pdf';
      const res = await api.get(urlPath, {
        params,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', type === 'full' ? 'full-report.pdf' : 'sales-report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('PDF export failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mt-4 disabled:opacity-60 ${type === 'full' ? 'ml-2' : ''}`}
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? 'Exporting...' : type === 'full' ? 'Export Full Report as PDF' : 'Export Sales as PDF'}
    </button>
  );
} 