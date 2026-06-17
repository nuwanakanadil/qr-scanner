import { RefreshCw, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorCardProps {
  message: string;
  onReset: () => void;
}

export function ErrorCard({ message, onReset }: ErrorCardProps) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-200/60"
      initial={{ opacity: 0, scale: 0.95 }}
    >
      <motion.div
        animate={{ scale: 1 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600"
        initial={{ scale: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <XCircle className="h-10 w-10" />
      </motion.div>

      <h2 className="mb-2 text-2xl font-bold text-slate-900">Scan Failed</h2>
      <p className="mb-8 text-slate-500">{message}</p>

      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition-colors hover:bg-slate-800"
        onClick={onReset}
        type="button"
      >
        <RefreshCw className="h-5 w-5" />
        Scan Again
      </button>
    </motion.div>
  );
}
