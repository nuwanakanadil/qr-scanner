import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { saveScan } from './api';
import { ConfirmDetailsModal } from './components/ConfirmDetailsModal';
import { ErrorCard } from './components/ErrorCard';
import { Header } from './components/Header';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { ScannerCard } from './components/ScannerCard';
import { SuccessCard } from './components/SuccessCard';
import { parseStudentFromQr } from './qrParser';
import { ScanStatus, Student } from './types';
import { useScreenInit } from './useScreenInit';

type AppState = 'scan' | 'success' | 'error';

export function App() {
  useScreenInit();

  const [appState, setAppState] = useState<AppState>('scan');
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetScanner = () => {
    setAppState('scan');
    setScanStatus('idle');
    setScannedStudent(null);
    setIsModalOpen(false);
    setErrorMessage('');
  };

  const handleQrScan = (decodedText: string) => {
    setErrorMessage('');
    setScanStatus('detected');

    window.setTimeout(() => {
      const student = parseStudentFromQr(decodedText);

      if (!student) {
        setErrorMessage(
          'Invalid QR format. QR must contain compact student data or JSON with id, name, faculty, course and batch.'
        );
        setAppState('error');
        setScanStatus('idle');
        return;
      }

      setScannedStudent(student);
      setScanStatus('loaded');
      setIsModalOpen(true);
    }, 400);
  };

  const handleUseSamplePayload = (samplePayload: string) => {
    handleQrScan(samplePayload);
  };

  const handleModalClose = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setScanStatus('idle');
    setScannedStudent(null);
  };

  const handleConfirm = async (notes: string, scanReference: string) => {
    if (!scannedStudent) return;

    setIsSaving(true);
    setScanStatus('saving');

    try {
      await saveScan({
        ...scannedStudent,
        notes,
        scanReference
      });

      setIsModalOpen(false);
      setAppState('success');
      setScanStatus('idle');
      setScannedStudent(null);
    } catch {
      setErrorMessage('Could not save to Google Sheet. Check Apps Script URL and deployment.');
      setIsModalOpen(false);
      setAppState('error');
      setScanStatus('idle');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex flex-1 items-center justify-center p-4 md:p-6">
        {appState === 'scan' && (
          <div className="grid w-full max-w-6xl items-start justify-center gap-6 lg:grid-cols-2">
            <div className="flex justify-center">
              <ScannerCard
                onErrorMessage={setErrorMessage}
                onQrScan={handleQrScan}
                status={scanStatus}
              />
            </div>

            <div className="flex justify-center">
              <QRCodeGenerator onUseSample={handleUseSamplePayload} />
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 lg:col-span-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {appState === 'success' && (
          <SuccessCard
            onScanAnother={resetScanner}
            onViewRecords={() => window.open(import.meta.env.VITE_GOOGLE_SHEET_URL, '_blank', 'noopener,noreferrer')}
          />
        )}

        {appState === 'error' && (
          <ErrorCard message={errorMessage} onReset={resetScanner} />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500">
        &copy; 2026 Agas Rashmitha. All rights reserved.
      </footer>

      <ConfirmDetailsModal
        isOpen={isModalOpen}
        isSaving={isSaving}
        onClose={handleModalClose}
        onConfirm={handleConfirm}
        student={scannedStudent}
      />
    </div>
  );
}
