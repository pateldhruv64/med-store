import Reports from '../components/reports/Reports';
import PdfExportButton from '../components/reports/PdfExportButton';

export default function ReportsPage() {
  return (
    <div className="w-full min-w-0 px-2 sm:px-4 sm:max-w-2xl sm:mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-2">Reports</h1>
      <Reports />
    </div>
  );
} 