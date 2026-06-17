import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { getRecentScans, saveScan } from './api';
import { ConfirmDetailsModal } from './components/ConfirmDetailsModal';
import { ErrorCard } from './components/ErrorCard';
import { Header } from './components/Header';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { RecordsDashboard } from './components/RecordsDashboard';
import { ScannerCard } from './components/ScannerCard';
import { SuccessCard } from './components/SuccessCard';
import { parseStudentFromQr } from './qrParser';
import { ScanRecord, ScanStatus, Student } from './types';
import { useScreenInit } from './useScreenInit.ts';

type AppState = 'scan' | 'success' | 'error';
type View = 'scanner' | 'records';

export function App() {
  useScreenInit();

  const [activeView, setActiveView] = useState<View>('scanner');
  const [appState, setAppState] = useState<AppState>('scan');
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  const loadRecords = async () => {
    setIsLoadingRecords(true);

    try {
      const result = await getRecentScans();
      setRecords(result.records);
      setTotalRecords(result.total);
    } catch {
      setErrorMessage('Backend is not running or records could not be loaded.');
    } finally {
      setIsLoadingRecords(false);
    }
  };

  useEffect(() => {
    void loadRecords();
  }, []);

  const resetScanner = () => {
    setActiveView('scanner');
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
          'Invalid QR format. QR must contain either compact student data or JSON with id, name, faculty, course and batch.'
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
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setScanStatus('idle');
    setScannedStudent(null);
  };

  const handleConfirm = async (notes: string, scanReference: string) => {
    if (!scannedStudent) {
      return;
    }

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
      await loadRecords();
    } catch {
      setErrorMessage('Could not save to Excel. Make sure the backend server is running.');
      setIsModalOpen(false);
      setAppState('error');
      setScanStatus('idle');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <Header activeView={activeView} onChangeView={setActiveView} />

      {activeView === 'records' ? (
        <RecordsDashboard
          isLoading={isLoadingRecords}
          onRefresh={loadRecords}
          records={records}
          totalRecords={totalRecords}
        />
      ) : (
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
              onViewRecords={() => setActiveView('records')}
            />
          )}

          {appState === 'error' && (
            <ErrorCard message={errorMessage} onReset={resetScanner} />
          )}
        </main>
      )}

      <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500">
        Records are saved row by row to the Excel file.
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
