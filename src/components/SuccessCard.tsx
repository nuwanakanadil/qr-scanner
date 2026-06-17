import { CheckCircle2, Download, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { getExcelDownloadUrl } from '../api';

interface SuccessCardProps {
  onScanAnother: () => void;
  onViewRecords: () => void;
}

export function SuccessCard({ onScanAnother, onViewRecords }: SuccessCardProps) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-200/60"
      initial={{ opacity: 0, scale: 0.95 }}
    >
      <motion.div
        animate={{ scale: 1 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
        initial={{ scale: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <CheckCircle2 className="h-10 w-10" />
      </motion.div>

      <h2 className="mb-2 text-2xl font-bold text-slate-900">Data saved successfully</h2>
      <p className="mb-8 text-slate-500">The student record has been added as a new row in the Excel file.</p>

      <div className="grid gap-3">
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
          onClick={onScanAnother}
          type="button"
        >
          <QrCode className="h-5 w-5" />
          Scan Another QR
        </button>
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
          onClick={onViewRecords}
          type="button"
        >
          View Recent Records
        </button>
        <a
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-900 px-4 py-3 font-medium text-white transition-colors hover:bg-slate-800"
          href={getExcelDownloadUrl()}
        >
          <Download className="h-5 w-5" />
          Download Excel
        </a>
      </div>
    </motion.div>
  );
}
