import { ScanRecord, Student } from './types';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface SaveScanPayload extends Student {
  scanReference: string;
  notes: string;
}

export async function saveScan(payload: SaveScanPayload): Promise<ScanRecord> {
  const response = await fetch(`${API_BASE_URL}/api/scans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to save scan');
  }

  return result.record;
}

export async function getRecentScans(): Promise<{ total: number; records: ScanRecord[] }> {
  const response = await fetch(`${API_BASE_URL}/api/scans?limit=20`);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to load records');
  }

  return {
    total: result.total,
    records: result.records
  };
}

export function getExcelDownloadUrl(): string {
  return `${API_BASE_URL}/api/scans/download`;
}
