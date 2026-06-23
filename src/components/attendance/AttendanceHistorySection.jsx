import { useState, useEffect, useCallback } from 'react'
import { MdHistory, MdSearch, MdPhone } from 'react-icons/md'
import toast from 'react-hot-toast'
import { attendanceService } from '../../services/attendanceService'
import { useDivisions } from '../../hooks/useDivisions'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

export default function AttendanceHistorySection() {
  const { divisions } = useDivisions()
  const [date, setDate] = useState('')
  const [divisionId, setDivisionId] = useState('')
  const [search, setSearch] = useState('')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const data = await attendanceService.getHistory({
        date: date || undefined,
        divisionId: divisionId || undefined,
        search: search || undefined,
      })
      setRecords(data)
    } catch (err) {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }, [date, divisionId, search])

  useEffect(() => {
    const t = setTimeout(fetchHistory, 300)
    return () => clearTimeout(t)
  }, [fetchHistory])

  const formatDate = (d) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Attendance History</h2>
        <p className="text-gray-500 text-sm mt-0.5">Browse all past attendance records</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="date"
          className="input sm:w-44"
          value={date}
          onChange={e => setDate(e.target.value)}
          placeholder="Filter by date"
        />
        <select
          className="input sm:w-44"
          value={divisionId}
          onChange={e => setDivisionId(e.target.value)}
        >
          <option value="">All Divisions</option>
          {divisions.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <div className="relative flex-1">
          <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="input pl-9"
            placeholder="Search student name or roll no..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {(date || divisionId || search) && (
          <button
            onClick={() => { setDate(''); setDivisionId(''); setSearch('') }}
            className="btn-secondary text-sm whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      <p className="text-gray-500 text-xs mb-3">{records.length} record{records.length !== 1 ? 's' : ''} found</p>

      {loading ? (
        <LoadingSpinner text="Loading history..." />
      ) : records.length === 0 ? (
        <div className="card p-6">
          <EmptyState
            icon={MdHistory}
            title="No records found"
            description="Try adjusting your filters or submit attendance from the dashboard."
          />
        </div>
      ) : (
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="border-b border-[#3a3b42]">
                {['Date', 'Roll No.', 'Student Name', 'Status', 'Mobile'].map(h => (
                  <th key={h} className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a3b42]">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-[#2e3038]/50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-400 text-sm whitespace-nowrap">
                    {r.attendance_sessions?.attendance_date
                      ? formatDate(r.attendance_sessions.attendance_date)
                      : '—'}
                  </td>
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
