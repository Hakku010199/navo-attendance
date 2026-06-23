import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  MdSchool, MdSettings, MdCheckCircle, MdCancel,
  MdRefresh, MdSend, MdWarning
} from 'react-icons/md'
import toast from 'react-hot-toast'
import { useDivisions } from '../hooks/useDivisions'
import { studentService } from '../services/studentService'
import { attendanceService } from '../services/attendanceService'
import AttendanceGrid from '../components/attendance/AttendanceGrid'
import AttendanceSummary from '../components/attendance/AttendanceSummary'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export default function Home() {
  const { divisions, loading: divisionsLoading } = useDivisions()
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [selectedDivision, setSelectedDivision] = useState('')
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({}) // { studentId: 'present' | 'absent' }
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)

  // Auto-select first division
  useEffect(() => {
    if (divisions.length > 0 && !selectedDivision) {
      setSelectedDivision(divisions[0].id)
    }
  }, [divisions, selectedDivision])

  // Load students when division changes
  const loadStudents = useCallback(async () => {
    if (!selectedDivision) return
    setLoadingStudents(true)
    try {
      const data = await studentService.getByDivision(selectedDivision)
      setStudents(data)
      // Default everyone to present
      const initial = {}
      data.forEach(s => { initial[s.id] = 'present' })
      setAttendance(initial)
    } catch {
      toast.error('Failed to load students')
    } finally {
      setLoadingStudents(false)
    }
  }, [selectedDivision])

  useEffect(() => { loadStudents() }, [loadStudents])

  // Check if attendance already submitted for selected date+division
  useEffect(() => {
    if (!selectedDate || !selectedDivision) return
    attendanceService.getSessionExists({ date: selectedDate, divisionId: selectedDivision })
      .then(exists => setAlreadySubmitted(exists))
      .catch(() => {})
  }, [selectedDate, selectedDivision])

  const toggleStudent = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'absent' ? 'present' : 'absent',
    }))
  }

  const markAll = (status) => {
    const updated = {}
    students.forEach(s => { updated[s.id] = status })
    setAttendance(updated)
  }

  const reset = () => {
    const initial = {}
    students.forEach(s => { initial[s.id] = 'present' })
    setAttendance(initial)
  }

  const submitAttendance = async () => {
    if (!selectedDate || !selectedDivision) {
      toast.error('Please select a date and division')
      return
    }
    if (students.length === 0) {
      toast.error('No students to submit attendance for')
      return
    }

    setSubmitting(true)
    try {
      const records = students.map(s => ({
        studentId: s.id,
        status: attendance[s.id] || 'present',
      }))
      await attendanceService.submitAttendance({
        date: selectedDate,
        divisionId: selectedDivision,
        records,
      })
      toast.success('Attendance submitted successfully!')
      setAlreadySubmitted(true)
    } catch (err) {
      toast.error(err.message || 'Failed to submit attendance')
    } finally {
      setSubmitting(false)
    }
  }

  const present = students.filter(s => attendance[s.id] !== 'absent').length
  const absent = students.length - present

  const divisionName = divisions.find(d => d.id === selectedDivision)?.name || ''

  return (
    <div className="min-h-screen bg-[#1e1f24]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#1e1f24]/90 backdrop-blur border-b border-[#3a3b42]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <MdSchool size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-100 leading-tight">Attendance Dashboard</h1>
              <p className="text-gray-500 text-xs">Mark daily student attendance</p>
            </div>
          </div>
         
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">
        {/* Date & Division selectors */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Date</label>
            <input
              type="date"
              className="input sm:w-48"
              value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); setAlreadySubmitted(false) }}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 sm:max-w-xs">
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Division</label>
            {divisionsLoading ? (
              <div className="input text-gray-500">Loading divisions...</div>
            ) : divisions.length === 0 ? (
              <div className="input text-gray-500">No divisions — add from Office</div>
            ) : (
              <select
                className="input"
                value={selectedDivision}
                onChange={e => { setSelectedDivision(e.target.value); setAlreadySubmitted(false) }}
              >
                {divisions.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Already submitted warning */}
        {alreadySubmitted && (
          <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
            <MdWarning className="text-amber-400 shrink-0" size={18} />
            <p className="text-amber-300 text-sm">
              Attendance for <strong>{divisionName}</strong> on this date has already been submitted. Submitting again will create a new session.
            </p>
          </div>
        )}

        {/* Summary */}
        <AttendanceSummary total={students.length} present={present} absent={absent} />

        {/* Grid header */}
        <div className="flex items-center justify-between">
          <h2 className="text-gray-300 font-medium text-sm">
            {selectedDivision ? `${divisionName} — ${students.length} students` : 'Select a division'}
          </h2>
        </div>

        {/* Grid */}
        {loadingStudents ? (
          <div className="card p-10 flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-[#3a3b42] border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <AttendanceGrid
            students={students}
            attendance={attendance}
            onToggle={toggleStudent}
          />
        )}

        {/* Action buttons */}
        {students.length > 0 && (
          <div className="flex flex-col gap-3">
            {/* Quick Action Buttons Row */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => markAll('present')}
                className="flex items-center justify-center text-sm px-4 py-2.5 rounded-lg bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 border border-gray-500/20 transition-all font-medium h-full"
              >
                Mark All Present
              </button>
              <button
                onClick={() => markAll('absent')}
                className="flex items-center justify-center text-sm px-4 py-2.5 rounded-lg bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 border border-gray-500/20 transition-all font-medium h-full"
              >
                Mark All Absent
              </button>
              <button
                onClick={reset}
                className="flex items-center justify-center text-sm px-4 py-2.5 rounded-lg bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 border border-gray-500/20 transition-all font-medium h-full"
              >
                Reset
              </button>
            </div>

            {/* Submit Attendance Button */}
            <button
              onClick={submitAttendance}
              disabled={submitting || students.length === 0}
              className="w-full flex items-center justify-center text-sm px-4 py-3 rounded-lg bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 border border-gray-500/20 transition-all font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
