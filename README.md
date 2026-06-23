# 🏫 School Attendance Management System

A production-ready React + Vite + Supabase attendance management app with a dark-themed UI.

---

## Tech Stack

- **React 18** + **Vite**
- **React Router DOM** (BrowserRouter)
- **Tailwind CSS**
- **Supabase** (database + backend)
- **React Hot Toast** (notifications)
- **React Icons** (icon set)

---

## Features

### Home Page (`/`)
- Select date and division
- Mark each student Present / Absent via color-coded grid
- Mark All Present / Mark All Absent / Reset buttons
- Live summary (Total / Present / Absent)
- Submit attendance to Supabase (new session every submit)

### Office Dashboard (`/office`)
| Section | Features |
|---|---|
| **Students** | Add / Edit / Delete / Search / Filter by Division |
| **Daily Attendance** | View attendance by date & division with status badges |
| **Attendance History** | Full history with date, division, name, status filters |
| **Divisions** | Add / Edit / Delete divisions (blocks delete if students assigned) |

---

## Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd attendance-app
npm install
```

### 2. Create `.env` file

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set up Supabase database

1. Go to [supabase.com](https://supabase.com) → your project → **SQL Editor**
2. Paste the contents of `supabase_schema.sql` and run it
3. This creates all tables, indexes, foreign keys, and RLS policies

### 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — the `vercel.json` handles SPA routing automatically

---

## Database Schema

```
divisions
  id, name, created_at

students
  id, roll_number, name, mobile, division_id → divisions.id, created_at

attendance_sessions
  id, attendance_date, division_id → divisions.id, created_at

attendance_records
  id, session_id → attendance_sessions.id, student_id → students.id, status, created_at
```

---

## Project Structure

```
src/
├── main.jsx              # BrowserRouter entry
├── App.jsx               # Toaster + Routes
├── index.css             # Tailwind + global classes
├── lib/
│   └── supabase.js       # Supabase client
├── services/
│   ├── divisionService.js
│   ├── studentService.js
│   └── attendanceService.js
├── hooks/
│   └── useDivisions.js
├── routes/
│   └── AppRoutes.jsx
├── pages/
│   ├── Home.jsx          # / — Attendance marking
│   └── Office.jsx        # /office — Dashboard
└── components/
    ├── attendance/
    │   ├── AttendanceGrid.jsx
    │   ├── AttendanceSummary.jsx
    │   ├── DailyAttendanceSection.jsx
    │   └── AttendanceHistorySection.jsx
    ├── students/
    │   ├── StudentsSection.jsx
    │   └── StudentModal.jsx
    ├── divisions/
    │   ├── DivisionsSection.jsx
    │   └── DivisionModal.jsx
    ├── common/
    │   ├── Modal.jsx
    │   ├── ConfirmModal.jsx
    │   ├── LoadingSpinner.jsx
    │   └── EmptyState.jsx
    └── layout/
        └── OfficeSidebar.jsx
```
