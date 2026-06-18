import { CheckCircle2, ExternalLink, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { openGoogleSheet } from '../api';

interface SuccessCardProps {
  onScanAnother: () => void;
  onViewRecords?: () => void;
}

export function SuccessCard({ onScanAnother, onViewRecords }: SuccessCardProps) {
  const handleOpenSheet = () => {
    if (onViewRecords) {
      onViewRecords();
      return;
    }

    openGoogleSheet();
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-xl shadow-slate-200/60"
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-11 w-11 text-emerald-600" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        Student record saved successfully
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        The student record has been added to the Google Sheet.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700"
          onClick={onScanAnother}
          type="button"
        >
          <QrCode className="h-5 w-5" />
          Scan Another QR
        </button>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          onClick={handleOpenSheet}
          type="button"
        >
          <ExternalLink className="h-5 w-5" />
          Open Google Sheet
        </button>
      </div>
    </motion.div>
  );
}