import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Check,
  Clock,
  FileText,
  GraduationCap,
  Hash,
  Loader2,
  Mail,
  Phone,
  User,
  X
} from 'lucide-react';
import { Student } from '../types';

interface ConfirmDetailsModalProps {
  isOpen: boolean;
  student: Student | null;
  isSaving: boolean;
  onClose: () => void;
  onConfirm: (notes: string, scanReference: string) => void;
}

export function ConfirmDetailsModal({
  isOpen,
  student,
  isSaving,
  onClose,
  onConfirm
}: ConfirmDetailsModalProps) {
  const [notes, setNotes] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [scanReference, setScanReference] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const now = new Date();
    const reference = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${now
      .getTime()
      .toString()
      .slice(-6)}`;

    setNotes('');
    setCurrentDate(
      now.toLocaleDateString('en-CA', {
        timeZone: 'Asia/Colombo'
      })
    );
    setCurrentTime(
      now.toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Colombo',
        hour12: false
      })
    );
    setScanReference(reference);
  }, [isOpen, student]);

  if (!student) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={isSaving ? undefined : onClose}
          />

          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="pointer-events-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Confirm Student Details</h2>
                  <p className="text-sm text-slate-500">The form is auto-filled from the scanned QR code.</p>
                </div>
                <button
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                  disabled={isSaving}
                  onClick={onClose}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto bg-slate-50/60 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <SectionTitle icon={<User className="h-4 w-4" />} title="Student Information" />
                  <ReadOnlyField icon={<Hash className="h-4 w-4" />} label="Student ID" value={student.id} />
                  <ReadOnlyField icon={<User className="h-4 w-4" />} label="Student Name" value={student.name} />
                  <ReadOnlyField
                    icon={<BookOpen className="h-4 w-4" />}
                    label="Faculty / Department"
                    value={student.faculty}
                  />
                  <ReadOnlyField
                    icon={<GraduationCap className="h-4 w-4" />}
                    label="Course / Program"
                    value={student.course}
                  />
                  <ReadOnlyField icon={<Calendar className="h-4 w-4" />} label="Batch / Year" value={student.batch} />

                  <SectionTitle icon={<Phone className="h-4 w-4" />} title="Contact Details" />
                  <ReadOnlyField icon={<Phone className="h-4 w-4" />} label="Phone Number" value={student.phone || '-'} />
                  <ReadOnlyField icon={<Mail className="h-4 w-4" />} label="Email" value={student.email || '-'} />

                  <SectionTitle icon={<FileText className="h-4 w-4" />} title="Scan Details" />
                  <ReadOnlyField icon={<Calendar className="h-4 w-4" />} label="Date" value={currentDate} />
                  <ReadOnlyField icon={<Clock className="h-4 w-4" />} label="Time" value={currentTime} />
                  <ReadOnlyField icon={<Hash className="h-4 w-4" />} label="QR Scan Reference" value={scanReference} />

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Notes (Optional)</label>
                    <textarea
                      className="h-24 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 transition-shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      disabled={isSaving}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Add any additional notes here..."
                      value={notes}
                    />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
                <button
                  className="rounded-xl px-5 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
                  disabled={isSaving}
                  onClick={onClose}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:bg-indigo-300"
                  disabled={isSaving}
                  onClick={() => onConfirm(notes, scanReference)}
                  type="button"
                >
                  {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                  {isSaving ? 'Saving...' : 'Confirm & Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface SectionTitleProps {
  icon: JSX.Element;
  title: string;
}

function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <h3 className="flex items-center gap-2 border-t border-slate-200 pt-4 text-sm font-semibold uppercase tracking-wider text-indigo-600 first:border-t-0 first:pt-0 md:col-span-2">
      {icon}
      {title}
    </h3>
  );
}

interface ReadOnlyFieldProps {
  label: string;
  value: string;
  icon: JSX.Element;
}

function ReadOnlyField({ label, value, icon }: ReadOnlyFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-100/80 px-3 py-2.5 text-slate-700">
        <div className="shrink-0 text-slate-400">{icon}</div>
        <span className="truncate text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}
