# QR Student Data Collector

This project contains a complete frontend + backend system.

## What it does

1. User scans a QR code.
2. QR contains student details as JSON.
3. Form is auto-filled from the QR data.
4. User confirms the details.
5. Backend saves the record as a new row in `student_scans.xlsx`.
6. Admin can view recent records and download the Excel file.

## Required QR data format

Create a QR using JSON like this:

```json
{
  "id": "STU-2026-001",
  "name": "Nuwanaka Nadil",
  "faculty": "Faculty of Computing",
  "course": "Software Engineering",
  "batch": "2026",
  "phone": "0771234567",
  "email": "student@example.com"
}
```

Required fields:

- `id`
- `name`
- `faculty`
- `course`
- `batch`

Optional fields:

- `phone`
- `email`

Date, time, timestamp and scan reference are generated automatically by the system.

## Install

```bash
npm install
```

## Run frontend and backend together

```bash
npm run dev:all
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

## Run separately

Terminal 1:

```bash
npm run server
```

Terminal 2:

```bash
npm run dev
```

## Excel file location

After the first successful save, the Excel file will be created here:

```text
backend/data/student_scans.xlsx
```

You can also download it from the UI using the Download Excel button.

## Important camera note

Browser camera access works on:

- `localhost`
- HTTPS domains

It usually does not work from normal HTTP hosting on another device.
