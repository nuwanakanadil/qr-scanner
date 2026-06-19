import { ExternalLink, GraduationCap, LogOut, QrCode } from 'lucide-react';
import { openGoogleSheet } from '../api';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <QrCode className="h-6 w-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                QR Data Hub
              </h1>
              <GraduationCap className="hidden h-5 w-5 text-indigo-600 sm:block" />
            </div>
            <p className="text-xs text-slate-500 sm:text-sm">
              Scan QR and save records to Google Sheet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openGoogleSheet}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Open Google Sheet</span>
            <span className="sm:hidden">Sheet</span>
          </button>

          <button
            onClick={onLogout}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
