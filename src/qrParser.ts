import { Student } from './types';

function getStringValue(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }

    if (typeof value === 'number') {
      return String(value);
    }
  }

  return '';
}

function parseJsonOrUrlPayload(qrText: string): Record<string, unknown> | null {
  const trimmedText = qrText.trim();

  try {
    return JSON.parse(trimmedText);
  } catch {
    // Try other formats below
  }

  try {
    const url = new URL(trimmedText);
    const dataParam = url.searchParams.get('data');

    if (dataParam) {
      return JSON.parse(decodeURIComponent(dataParam));
    }

    const paramsObject: Record<string, unknown> = {};

    url.searchParams.forEach((value, key) => {
      paramsObject[key] = value;
    });

    return Object.keys(paramsObject).length > 0 ? paramsObject : null;
  } catch {
    return null;
  }
}

function parseCompactPayload(qrText: string): Student | null {
  const cleanedText = qrText.trim();

  const parts = cleanedText.split('|').map((part) => part.trim());

  if (parts.length < 5) {
    return null;
  }

  const student: Student = {
    id: parts[0] || '',
    name: parts[1] || '',
    faculty: parts[2] || '',
    course: parts[3] || '',
    batch: parts[4] || '',
    phone: parts[5] || '',
    email: parts[6] || ''
  };

  const hasRequiredData = Boolean(
    student.id &&
      student.name &&
      student.faculty &&
      student.course &&
      student.batch
  );

  return hasRequiredData ? student : null;
}

export function parseStudentFromQr(qrText: string): Student | null {
  const payload = parseJsonOrUrlPayload(qrText);

  if (!payload) {
    return parseCompactPayload(qrText);
  }

  const student: Student = {
    id: getStringValue(payload, ['id', 'studentId', 'studentID', 'student_id', 'sid']),
    name: getStringValue(payload, ['name', 'studentName', 'student_name', 'fullName']),
    faculty: getStringValue(payload, ['faculty', 'department', 'dept', 'facultyDepartment']),
    course: getStringValue(payload, ['course', 'program', 'programme', 'courseProgram']),
    batch: getStringValue(payload, ['batch', 'year', 'batchYear', 'class']),
    phone: getStringValue(payload, ['phone', 'phoneNumber', 'mobile', 'contact']),
    email: getStringValue(payload, ['email', 'emailAddress'])
  };

  const hasRequiredData = Boolean(
    student.id &&
      student.name &&
      student.faculty &&
      student.course &&
      student.batch
  );

  return hasRequiredData ? student : null;
}

export const SAMPLE_QR_PAYLOAD =
  'STU-2026-101|Maya Fernando|School of Computing|Information Systems|2026|0715550101|maya.fernando@example.edu';

export const SAMPLE_JSON_QR_PAYLOAD = JSON.stringify(
  {
    id: 'STU-2026-102',
    name: 'Dilan Jayasekara',
    faculty: 'School of Engineering',
    course: 'Data Science',
    batch: '2025',
    phone: '0725550102',
    email: 'dilan.jayasekara@example.edu'
  },
  null,
  2
);
