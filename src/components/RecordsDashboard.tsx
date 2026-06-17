import { Download, RefreshCw, Table2 } from 'lucide-react';
import { getExcelDownloadUrl } from '../api';
import { ScanRecord } from '../types';

interface RecordsDashboardProps {
  records: ScanRecord[];
  totalRecords: number;
  isLoading: boolean;
  onRefresh: () => void;
}

export function RecordsDashboard({ records, totalRecords, isLoading, onRefresh }: RecordsDashboardProps) {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' });
  const totalToday = records.filter((record) => record.date === today).length;
  const lastScan = records[0]?.timestamp || '-';

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Records Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Recent QR submissions saved to the Excel file.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            onClick={onRefresh}
            type="button"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Records
          </button>
          <a
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
            href={getExcelDownloadUrl()}
          >
            <Download className="h-4 w-4" />
            Download Excel
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Total Scans Today" value={String(totalToday)} />
        <StatCard label="Total Records" value={String(totalRecords)} />
        <StatCard label="Last Scan Time" value={lastScan} />
        <StatCard label="Export Status" value="Excel Ready" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Table2 className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">Recent Submissions</h3>
          </div>
          <span className="text-sm text-slate-500">{records.length} shown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Student ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Batch</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-500" colSpan={8}>
                    No records yet. Scan a QR and confirm to save the first row.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr className="hover:bg-slate-50/60" key={`${record.scanNo}-${record.scanReference}`}>
                    <td className="px-5 py-4 font-medium text-slate-900">{record.id}</td>
                    <td className="px-5 py-4 text-slate-700">{record.name}</td>
                    <td className="px-5 py-4 text-slate-700">{record.faculty}</td>
                    <td className="px-5 py-4 text-slate-700">{record.course}</td>
                    <td className="px-5 py-4 text-slate-700">{record.batch}</td>
                    <td className="px-5 py-4 text-slate-700">{record.date}</td>
                    <td className="px-5 py-4 text-slate-700">{record.time}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {record.status || 'Saved'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 truncate text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
