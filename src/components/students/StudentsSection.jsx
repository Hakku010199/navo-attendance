import { useState, useEffect, useCallback } from 'react'
import { MdAdd, MdEdit, MdDelete, MdSearch, MdPeople, MdPhone } from 'react-icons/md'
import toast from 'react-hot-toast'
import { studentService } from '../../services/studentService'
import { useDivisions } from '../../hooks/useDivisions'
import StudentModal from './StudentModal'
import ConfirmModal from '../common/ConfirmModal'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

export default function StudentsSection() {
  const { divisions } = useDivisions()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [divisionFilter, setDivisionFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editStudent, setEditStudent] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const data = await studentService.getAll({ divisionId: divisionFilter || undefined, search: search || undefined })
      setStudents(data)
    } catch (err) {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }, [divisionFilter, search])

  useEffect(() => {
    const t = setTimeout(fetchStudents, 300)
    return () => clearTimeout(t)
  }, [fetchStudents])

  const handleSave = async (form, id) => {
    if (id) {
      await studentService.update(id, form)
      toast.success('Student updated')
    } else {
      await studentService.create(form)
      toast.success('Student added')
    }
    fetchStudents()
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await studentService.delete(deleteTarget.id)
      toast.success('Student deleted')
      setDeleteTarget(null)
      fetchStudents()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-100">Students</h2>
          <p className="text-gray-500 text-sm mt-0.5">{students.length} student{students.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setEditStudent(null); setModalOpen(true) }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <MdAdd size={18} />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="input pl-9"
            placeholder="Search by name or roll number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-48"
          value={divisionFilter}
          onChange={e => setDivisionFilter(e.target.value)}
        >
          <option value="">All Divisions</option>
          {divisions.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading students..." />
      ) : students.length === 0 ? (
        <div className="card p-6">
          <EmptyState
            icon={MdPeople}
            title={search || divisionFilter ? 'No students match your filters' : 'No students yet'}
            description={!search && !divisionFilter ? 'Add your first student to get started.' : undefined}
            action={!search && !divisionFilter ? (
              <button
                onClick={() => { setEditStudent(null); setModalOpen(true) }}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <MdAdd size={16} /> Add Student
              </button>
            ) : undefined}
          />
        </div>
      ) : (
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#3a3b42]">
                {['Roll No.', 'Student Name', 'Mobile Number', 'Division', ''].map(h => (
                  <th key={h} className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a3b42]">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-[#2e3038]/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-sm text-gray-300">{s.roll_number}</td>
                  <td className="px-5 py-3.5 text-gray-100 font-medium">{s.name}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                      {s.mobile}
                      <button
                        onClick={() => window.location.href = `tel:${s.mobile}`}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        title={`Call ${s.name}`}
                      >
                        <MdPhone size={15} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-sm">{s.divisions?.name}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditStudent(s); setModalOpen(true) }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                        title="Edit"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <StudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        student={editStudent}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All attendance records for this student will also be removed.`}
        loading={deleting}
      />
    </div>
  )
}
