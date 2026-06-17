import { Download, LayoutDashboard, QrCode } from 'lucide-react';
import { getExcelDownloadUrl } from '../api';

interface HeaderProps {
  activeView: 'scanner' | 'records';
  onChangeView: (view: 'scanner' | 'records') => void;
}

export function Header({ activeView, onChangeView }: HeaderProps) {
  const linkClass = (view: 'scanner' | 'records') => {
    return `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      activeView === view
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur md:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <button
          onClick={() => onChangeView('scanner')}
          className="flex items-center gap-3 text-left"
          type="button"
        >
          <div className="rounded-xl bg-indigo-600 p-2 text-white">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 sm:text-xl">
              QR Student Collector
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Scan QR, confirm details, save to Excel
            </p>
          </div>
        </button>

        <nav className="flex items-center gap-2">
          <button className={linkClass('scanner')} onClick={() => onChangeView('scanner')} type="button">
            <QrCode className="mr-1 inline h-4 w-4" />
            Scanner
          </button>
          <button className={linkClass('records')} onClick={() => onChangeView('records')} type="button">
            <LayoutDashboard className="mr-1 inline h-4 w-4" />
            Records
          </button>
          <a
            href={getExcelDownloadUrl()}
            className="hidden rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 sm:inline-flex sm:items-center sm:gap-2"
          >
            <Download className="h-4 w-4" />
            Excel
          </a>
        </nav>
      </div>
    </header>
  );
}
