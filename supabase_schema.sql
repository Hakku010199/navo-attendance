-- ============================================================
-- SCHOOL ATTENDANCE MANAGEMENT SYSTEM — SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- DIVISIONS
CREATE TABLE IF NOT EXISTS divisions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_divisions_name ON divisions (name);

-- STUDENTS
CREATE TABLE IF NOT EXISTS students (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_number  text NOT NULL,
  name         text NOT NULL,
  mobile       text NOT NULL,
  division_id  uuid NOT NULL REFERENCES divisions(id) ON DELETE RESTRICT,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (roll_number, division_id)
);

CREATE INDEX IF NOT EXISTS idx_students_division ON students (division_id);
CREATE INDEX IF NOT EXISTS idx_students_name ON students (name);

-- ATTENDANCE SESSIONS
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_date  date NOT NULL,
  division_id      uuid NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_date        ON attendance_sessions (attendance_date);
CREATE INDEX IF NOT EXISTS idx_sessions_division    ON attendance_sessions (division_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date_div    ON attendance_sessions (attendance_date, division_id);

-- ATTENDANCE RECORDS
CREATE TABLE IF NOT EXISTS attendance_records (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status      text NOT NULL CHECK (status IN ('present', 'absent')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_records_session ON attendance_records (session_id);
CREATE INDEX IF NOT EXISTS idx_records_student ON attendance_records (student_id);
CREATE INDEX IF NOT EXISTS idx_records_status  ON attendance_records (status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable for production. For development you can skip this.
-- ============================================================

ALTER TABLE divisions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE students           ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Allow all for anon key (adjust to your auth strategy)
CREATE POLICY "Allow all for anon" ON divisions          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON students           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON attendance_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON attendance_records FOR ALL USING (true) WITH CHECK (true);
