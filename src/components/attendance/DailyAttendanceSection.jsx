import { useState, useEffect, useCallback } from 'react'
import { MdCalendarToday, MdPhone } from 'react-icons/md'
import toast from 'react-hot-toast'
import { attendanceService } from '../../services/attendanceService'
import { useDivisions } from '../../hooks/useDivisions'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

function today() {
  return new Date().toISOString().split('T')[0]
}

export default function DailyAttendanceSection() {
  const { divisions } = useDivisions()
  const [date, setDate] = useState(today())
  const [divisionId, setDivisionId] = useState('')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchRecords = useCallback(async () => {
    if (!date) return
    setLoading(true)
    try {
      const data = await attendanceService.getDailyAttendance({ date, divisionId: divisionId || undefined })
      setRecords(data)
    } catch (err) {
      toast.error('Failed to load attendance')
    } finally {
      setLoading(false)
    }
  }, [date, divisionId])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  const present = records.filter(r => r.status === 'present').length
  const absent = records.filter(r => r.status === 'absent').length

  const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Daily Attendance</h2>
        <p className="text-gray-500 text-sm mt-0.5">View attendance taken on a selected day</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="date"
          className="input sm:w-48"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <select
          className="input sm:w-48"
          value={divisionId}
          onChange={e => setDivisionId(e.target.value)}
        >
          <option value="">All Divisions</option>
          {divisions.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      {records.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <SummaryCard label="Total" value={records.length} color="text-gray-100" bg="bg-[#26272d]" />
          <SummaryCard label="Present" value={present} color="text-green-400" bg="bg-green-500/10" />
          <SummaryCard label="Absent" value={absent} color="text-red-400" bg="bg-red-500/10" />
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Loading attendance..." />
      ) : records.length === 0 ? (
        <div className="card p-6">
          <EmptyState
            icon={MdCalendarToday}
            title="No attendance found"
            description={`No attendance recorded for ${date ? formatDate(date) : 'selected date'}${divisionId ? ' in selected division' : ''}.`}
          />
        </div>
      ) : (
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="border-b border-[#3a3b42]">
                {['Roll No.', 'Student Name', 'Status', 'Mobile'].map(h => (
                  <th key={h} className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a3b42]">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-[#2e3038]/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-sm text-gray-300">{r.students?.roll_number}</td>
                  <td className="px-5 py-3.5 text-gray-100 font-medium">{r.students?.name}</td>
                  <td className="px-5 py-3.5">
                    <span className={r.status === 'present' ? 'badge-present' : 'badge-absent'}>
                      {r.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                      {r.students?.mobile}
                      <button
                        onClick={() => window.location.href = `tel:${r.students?.mobile}`}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <MdPhone size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, value, color, bg }) {
  return (
    <div className={`card p-4 ${bg}`}>
      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
