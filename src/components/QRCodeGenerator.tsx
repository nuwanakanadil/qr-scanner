import { useEffect, useState } from 'react';
import * as QRCode from 'qrcode';
import { Copy, Download, QrCode } from 'lucide-react';
import { SAMPLE_JSON_QR_PAYLOAD, SAMPLE_QR_PAYLOAD } from '../qrParser';

interface QRCodeGeneratorProps {
  onUseSample: (samplePayload: string) => void;
}

export function QRCodeGenerator({ onUseSample }: QRCodeGeneratorProps) {
  const [payload, setPayload] = useState(SAMPLE_QR_PAYLOAD);
  const [qrImage, setQrImage] = useState('');
  const [copyText, setCopyText] = useState('Copy Data');

  useEffect(() => {
    QRCode.toDataURL(payload, {
      margin: 2,
      width: 520,
      errorCorrectionLevel: 'M'
    })
      .then((url) => setQrImage(url))
      .catch(() => setQrImage(''));
  }, [payload]);

  const copyPayload = async () => {
    await navigator.clipboard.writeText(payload);
    setCopyText('Copied');
    window.setTimeout(() => setCopyText('Copy Data'), 1200);
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
          <QrCode className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-bold text-slate-900">Test QR Generator</h3>
          <p className="text-sm text-slate-500">
            Use Easy Compact QR for better laptop webcam scanning.
          </p>
        </div>
      </div>

      <textarea
        className="h-32 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
        onChange={(event) => setPayload(event.target.value)}
        value={payload}
      />

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
          onClick={() => setPayload(SAMPLE_QR_PAYLOAD)}
          type="button"
        >
          Use Easy Compact QR
        </button>

        <button
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          onClick={() => setPayload(SAMPLE_JSON_QR_PAYLOAD)}
          type="button"
        >
          Use JSON QR
        </button>
      </div>

      {qrImage && (
        <div className="mt-4 flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4">
          <img
            alt="Generated student QR"
            className="h-72 w-72 rounded-lg bg-white p-3"
            src={qrImage}
          />

          <p className="mt-2 text-center text-xs text-slate-500">
            Open this QR on another phone/laptop at full brightness and scan it using the scanner.
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          onClick={copyPayload}
          type="button"
        >
          <Copy className="h-4 w-4" />
          {copyText}
        </button>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          onClick={() => onUseSample(payload)}
          type="button"
        >
          Use Sample
        </button>

        {qrImage && (
          <a
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            download="student-qr.png"
            href={qrImage}
          >
            <Download className="h-4 w-4" />
            QR PNG
          </a>
        )}
      </div>
    </div>
  );
}