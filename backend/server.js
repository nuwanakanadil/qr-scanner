import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const EXCEL_PATH = path.join(DATA_DIR, 'student_scans.xlsx');
const SHEET_NAME = 'Student Scans';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const EXCEL_HEADERS = [
  'Scan No',
  'Student ID',
  'Student Name',
  'Faculty / Department',
  'Course / Program',
  'Batch / Year',
  'Phone Number',
  'Email',
  'Scan Date',
  'Scan Time',
  'Full Timestamp',
  'QR Scan Reference',
  'Notes',
  'Status'
];

let writeQueue = Promise.resolve();

function getSriLankaDateTime() {
  const now = new Date();

  const date = now.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Colombo'
  });

  const time = now.toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Colombo',
    hour12: false
  });

  return {
    date,
    time,
    timestamp: `${date} ${time}`
  };
}

function createEmptyWorkbook() {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([], { header: EXCEL_HEADERS });
  worksheet['!cols'] = [
    { wch: 10 },
    { wch: 18 },
    { wch: 26 },
    { wch: 24 },
    { wch: 28 },
    { wch: 16 },
    { wch: 18 },
    { wch: 28 },
    { wch: 14 },
    { wch: 14 },
    { wch: 22 },
    { wch: 24 },
    { wch: 35 },
    { wch: 12 }
  ];
  XLSX.utils.book_append_sheet(workbook, worksheet, SHEET_NAME);
  return workbook;
}

function ensureExcelFile() {
  if (!fs.existsSync(EXCEL_PATH)) {
    const workbook = createEmptyWorkbook();
    XLSX.writeFile(workbook, EXCEL_PATH);
  }
}

function readExcelRows() {
  ensureExcelFile();
  const workbook = XLSX.readFile(EXCEL_PATH);
  const worksheet = workbook.Sheets[SHEET_NAME];

  if (!worksheet) {
    return [];
  }

  return XLSX.utils.sheet_to_json(worksheet, { defval: '' });
}

function writeExcelRows(rows) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: EXCEL_HEADERS });
  worksheet['!cols'] = [
    { wch: 10 },
    { wch: 18 },
    { wch: 26 },
    { wch: 24 },
    { wch: 28 },
    { wch: 16 },
    { wch: 18 },
    { wch: 28 },
    { wch: 14 },
    { wch: 14 },
    { wch: 22 },
    { wch: 24 },
    { wch: 35 },
    { wch: 12 }
  ];
  XLSX.utils.book_append_sheet(workbook, worksheet, SHEET_NAME);
  XLSX.writeFile(workbook, EXCEL_PATH);
}

function normalizeExcelRow(row) {
  return {
    scanNo: row['Scan No'],
    id: row['Student ID'],
    name: row['Student Name'],
    faculty: row['Faculty / Department'],
    course: row['Course / Program'],
    batch: row['Batch / Year'],
    phone: row['Phone Number'],
    email: row['Email'],
    date: row['Scan Date'],
    time: row['Scan Time'],
    timestamp: row['Full Timestamp'],
    scanReference: row['QR Scan Reference'],
    notes: row.Notes,
    status: row.Status
  };
}

function validateStudentPayload(body) {
  const requiredFields = ['id', 'name', 'faculty', 'course', 'batch'];
  const missingFields = requiredFields.filter((field) => {
    return !body[field] || String(body[field]).trim() === '';
  });

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }

  return null;
}

function generateReference() {
  const randomText = Math.random().toString(36).slice(2, 8).toUpperCase();
  const timeText = Date.now().toString().slice(-6);
  return `REF-${randomText}-${timeText}`;
}

async function runExclusive(task) {
  const previousQueue = writeQueue;
  let releaseQueue = () => {};

  writeQueue = new Promise((resolve) => {
    releaseQueue = resolve;
  });

  await previousQueue.catch(() => {});

  try {
    return await task();
  } finally {
    releaseQueue();
  }
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'QR Student Data Collector backend is running'
  });
});

app.get('/api/scans', (req, res) => {
  try {
    const limit = Number(req.query.limit || 20);
    const rows = readExcelRows();
    const records = rows.map(normalizeExcelRow).reverse().slice(0, limit);

    res.json({
      success: true,
      total: rows.length,
      records
    });
  } catch (error) {
    console.error('Read records error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to read scan records'
    });
  }
});

app.post('/api/scans', async (req, res) => {
  try {
    const validationError = validateStudentPayload(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const savedRecord = await runExclusive(async () => {
      const rows = readExcelRows();
      const { date, time, timestamp } = getSriLankaDateTime();
      const scanNo = rows.length + 1;

      const newRow = {
        'Scan No': scanNo,
        'Student ID': String(req.body.id).trim(),
        'Student Name': String(req.body.name).trim(),
        'Faculty / Department': String(req.body.faculty).trim(),
        'Course / Program': String(req.body.course).trim(),
        'Batch / Year': String(req.body.batch).trim(),
        'Phone Number': String(req.body.phone || '').trim(),
        Email: String(req.body.email || '').trim(),
        'Scan Date': date,
        'Scan Time': time,
        'Full Timestamp': timestamp,
        'QR Scan Reference': String(req.body.scanReference || generateReference()).trim(),
        Notes: String(req.body.notes || '').trim(),
        Status: 'Saved'
      };

      rows.push(newRow);
      writeExcelRows(rows);
      return normalizeExcelRow(newRow);
    });

    res.status(201).json({
      success: true,
      message: 'Student scan saved to Excel successfully',
      record: savedRecord
    });
  } catch (error) {
    console.error('Save scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save scan to Excel'
    });
  }
});

app.get('/api/scans/download', (req, res) => {
  try {
    ensureExcelFile();
    res.download(EXCEL_PATH, 'student_scans.xlsx');
  } catch (error) {
    console.error('Download Excel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download Excel file'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
