import { ScanRecord, Student } from './types';

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;
const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL as string;

export type SaveScanPayload = Student & {
  notes?: string;
  scanReference?: string;
};

export async function saveScan(payload: SaveScanPayload) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('Missing VITE_APPS_SCRIPT_URL in .env file');
  }

  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  });

  return {
    success: true,
    message: 'Record sent to Google Sheet'
  };
}

export async function getRecentScans(): Promise<{
  records: ScanRecord[];
  total: number;
}> {
  return {
    records: [],
    total: 0
  };
}

export function getExcelDownloadUrl(): string {
  return GOOGLE_SHEET_URL || '#';
}