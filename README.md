# QR Student Data Collector

This project is a Vite frontend for scanning student QR codes, reviewing the auto-filled details, and sending the final record to Google Sheets through Apps Script.

## What it does

1. User signs in with the frontend login screen.
2. User scans a QR code.
3. Student details are auto-filled from the QR data.
4. User confirms the details.
5. The app sends the record to Google Sheets.
6. User can open the target Google Sheet directly from the UI.

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

## Required environment variables

Create a `.env` file with:

```bash
VITE_LOGIN_USERNAME=admin
VITE_LOGIN_PASSWORD=supersecret
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-deployment/exec
VITE_GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/your-sheet-id/edit
```

## Install

```bash
pnpm install
```

## Run frontend

```bash
pnpm run dev
```

Frontend:

```text
http://localhost:5173
```

## Build for Vercel

```bash
pnpm build
```

Vercel will use the `build` script from [package.json](/C:/Users/nuwan/Videos/qr-scanner/package.json) and the `packageManager` field is already pinned to `pnpm`.

## Important camera note

Browser camera access works on:

- `localhost`
- HTTPS domains

It usually does not work from normal HTTP hosting on another device.
