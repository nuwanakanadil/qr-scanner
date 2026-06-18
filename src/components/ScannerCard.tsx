import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeFullConfig, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  AlertCircle,
  Camera,
  CameraOff,
  CheckCircle2,
  QrCode,
  RefreshCw,
  ScanLine
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ScanStatus } from '../types';

interface ScannerCardProps {
  status: ScanStatus;
  onQrScan: (decodedText: string) => void;
  onErrorMessage: (message: string) => void;
}

type CameraDevice = {
  id: string;
  label: string;
};

const QR_READER_ID = 'student-qr-reader';
const SCANNER_CONFIG: Html5QrcodeFullConfig = {
  verbose: false,
  formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
  experimentalFeatures: {
    useBarCodeDetectorIfSupported: true
  }
};

function getReadableCameraError(error: unknown) {
  const rawMessage = error instanceof Error ? error.message : String(error || 'Unknown camera error');
  const lowerMessage = rawMessage.toLowerCase();

  if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'Camera is blocked because this page is not secure. Open the app using localhost on this computer or use HTTPS.';
  }

  if (lowerMessage.includes('notallowed') || lowerMessage.includes('permission')) {
    return 'Camera permission was denied. Click the camera icon in the browser address bar and allow camera access.';
  }

  if (lowerMessage.includes('notfound') || lowerMessage.includes('device not found')) {
    return 'No camera was found on this device. Connect/enable a camera and try again.';
  }

  if (lowerMessage.includes('notreadable') || lowerMessage.includes('track start')) {
    return 'Camera is already being used by another app. Close Zoom, Teams, OBS, Camera app, or another browser tab and try again.';
  }

  if (lowerMessage.includes('overconstrained')) {
    return 'The selected camera does not support the requested video size. Try another camera from the list.';
  }

  return `Camera could not start. Try another browser or close other camera apps. Details: ${rawMessage}`;
}

function chooseDefaultCamera(cameras: CameraDevice[]) {
  return (
    cameras.find((camera) => /back|rear|environment/i.test(camera.label)) ||
    cameras.find((camera) => /camera|webcam|integrated/i.test(camera.label)) ||
    cameras[0]
  );
}

async function getAvailableCameras() {
  const devices = await Html5Qrcode.getCameras();

  if (!devices || devices.length === 0) {
    throw new Error('No camera devices returned by browser');
  }

  return devices.map((device, index) => ({
    id: device.id,
    label: device.label || `Camera ${index + 1}`
  }));
}

export function ScannerCard({ status, onQrScan, onErrorMessage }: ScannerCardProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isCameraRunning, setIsCameraRunning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [selectedCameraLabel, setSelectedCameraLabel] = useState('');

  const stopCamera = async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      setIsCameraRunning(false);
      setSelectedCameraLabel('');
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch {
      // Already stopped
    }

    try {
      await scanner.clear();
    } catch {
      // Ignore clear errors
    } finally {
      scannerRef.current = null;
      setIsCameraRunning(false);
      setSelectedCameraLabel('');
    }
  };

  const loadCameras = async () => {
    try {
      setCameraError('');
      onErrorMessage('');

      const mappedDevices = await getAvailableCameras();

      setCameras(mappedDevices);

      if (!selectedCameraId) {
        const defaultCamera = chooseDefaultCamera(mappedDevices);
        setSelectedCameraId(defaultCamera.id);
      }
    } catch (error) {
      const message = getReadableCameraError(error);
      setCameraError(message);
      onErrorMessage(message);
    }
  };

  const startCamera = async () => {
    setCameraError('');
    onErrorMessage('');

    if (scannerRef.current) {
      await stopCamera();
    }

    try {
      let availableCameras = cameras;

      if (availableCameras.length === 0) {
        availableCameras = await getAvailableCameras();
        setCameras(availableCameras);
      }

      const chosenCamera =
        availableCameras.find((camera) => camera.id === selectedCameraId) ||
        chooseDefaultCamera(availableCameras);

      setSelectedCameraId(chosenCamera.id);
      setSelectedCameraLabel(chosenCamera.label || 'Selected camera');

      const scanner = new Html5Qrcode(QR_READER_ID, SCANNER_CONFIG);
      scannerRef.current = scanner;

      await scanner.start(
        chosenCamera.id,
        {
          fps: 15,
          disableFlip: false
        },
        async (decodedText) => {
          await stopCamera();
          onQrScan(decodedText);
        },
        () => {
          // Ignore frame-by-frame scan errors
        }
      );

      setIsCameraRunning(true);
    } catch (error) {
      const message = getReadableCameraError(error);
      setCameraError(message);
      onErrorMessage(message);
      setIsCameraRunning(false);
      setSelectedCameraLabel('');
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        setCameraError('');
        onErrorMessage('');

        const mappedDevices = await getAvailableCameras();
        setCameras(mappedDevices);

        if (!selectedCameraId) {
          const defaultCamera = chooseDefaultCamera(mappedDevices);
          setSelectedCameraId(defaultCamera.id);
        }
      } catch (error) {
        const message = getReadableCameraError(error);
        setCameraError(message);
        onErrorMessage(message);
      }
    })();

    return () => {
      void stopCamera();
    };
  }, [onErrorMessage, selectedCameraId]);

  const statusLabel = {
    idle: isCameraRunning ? 'Scanning...' : 'Waiting for scan...',
    scanning: 'Scanning...',
    detected: 'QR detected. Reading data...',
    loaded: 'Student details loaded',
    saving: 'Saving to Excel...'
  }[status];

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
      <div className="border-b border-slate-100 p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Scan QR</h2>
        <p className="mt-1 text-sm text-slate-500">Use the compact QR format for better scanning</p>
      </div>

      <div className="bg-slate-50/70 p-6">
        <div className="relative mx-auto aspect-video w-full max-w-xl overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100">
          <div id={QR_READER_ID} className="scanner-reader h-full w-full overflow-hidden rounded-2xl" />

          {!isCameraRunning && status === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-center">
              <QrCode className="h-24 w-24 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-500">Camera is not started</p>
            </div>
          )}

          {(isCameraRunning || status === 'detected' || status === 'saving') && (
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-4 top-4 h-12 w-12 rounded-tl-xl border-l-4 border-t-4 border-indigo-500" />
              <div className="absolute right-4 top-4 h-12 w-12 rounded-tr-xl border-r-4 border-t-4 border-indigo-500" />
              <div className="absolute bottom-4 left-4 h-12 w-12 rounded-bl-xl border-b-4 border-l-4 border-indigo-500" />
              <div className="absolute bottom-4 right-4 h-12 w-12 rounded-br-xl border-b-4 border-r-4 border-indigo-500" />

              <motion.div
                animate={{ y: ['12%', '88%', '12%'] }}
                className="absolute left-8 right-8 h-1 rounded-full bg-indigo-500 shadow-[0_0_18px_rgba(99,102,241,0.85)]"
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}

          {status === 'loaded' && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            disabled={isCameraRunning}
            onChange={(event) => setSelectedCameraId(event.target.value)}
            value={selectedCameraId}
          >
            {cameras.length === 0 ? (
              <option value="">No camera loaded</option>
            ) : (
              cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label}
                </option>
              ))
            )}
          </select>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:text-slate-400"
            disabled={isCameraRunning}
            onClick={loadCameras}
            type="button"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="mt-5 flex min-h-10 items-center justify-center text-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            {status === 'loaded' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : status === 'idle' && !isCameraRunning ? (
              <ScanLine className="h-5 w-5 text-slate-500" />
            ) : (
              <ScanLine className="h-5 w-5 animate-pulse text-indigo-600" />
            )}
            {statusLabel}
          </div>
        </div>

        {selectedCameraLabel && (
          <p className="mt-2 text-center text-xs text-slate-500">Using: {selectedCameraLabel}</p>
        )}

        <p className="mt-3 text-center text-xs text-slate-500">
          Tip: Use the Easy Compact QR, increase screen brightness, and hold the QR steady 15–30 cm from the camera.
        </p>

        {cameraError && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}
      </div>

      <div className="grid gap-3 border-t border-slate-100 bg-white p-6 sm:grid-cols-2">
        <button
          onClick={startCamera}
          disabled={isCameraRunning || status === 'saving'}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-300"
          type="button"
        >
          <Camera className="h-5 w-5" />
          Start Scan
        </button>

        <button
          onClick={stopCamera}
          disabled={!isCameraRunning}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:text-slate-400"
          type="button"
        >
          <CameraOff className="h-5 w-5" />
          Stop Scan
        </button>
      </div>
    </div>
  );
}
