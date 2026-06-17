export interface Student {
  id: string;
  name: string;
  faculty: string;
  course: string;
  batch: string;
  phone: string;
  email: string;
}

export interface ScanRecord extends Student {
  scanNo: number;
  date: string;
  time: string;
  timestamp: string;
  scanReference: string;
  notes: string;
  status: string;
}

export type ScanStatus = 'idle' | 'scanning' | 'detected' | 'loaded' | 'saving';
