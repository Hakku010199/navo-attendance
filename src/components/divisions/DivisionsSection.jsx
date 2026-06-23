import { useState } from 'react'
import { MdAdd, MdEdit, MdDelete, MdClass } from 'react-icons/md'
import toast from 'react-hot-toast'
import { useDivisions } from '../../hooks/useDivisions'
import { divisionService } from '../../services/divisionService'
import DivisionModal from './DivisionModal'
import ConfirmModal from '../common/ConfirmModal'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

export default function DivisionsSection() {
  const { divisions, loading, refetch } = useDivisions(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editDivision, setEditDivision] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleSave = async (name, id) => {
    if (id) {
      await divisionService.update(id, name)
      toast.success('Division updated')
    } else {
      await divisionService.create(name)
      toast.success('Division created')
    }
    refetch()
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await divisionService.delete(deleteTarget.id)
      toast.success('Division deleted')
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const openEdit = (div) => {
    setEditDivision(div)
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditDivision(null)
    setModalOpen(true)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-100">Divisions</h2>
          <p className="text-gray-500 text-sm mt-0.5">{divisions.length} division{divisions.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <MdAdd size={18} />
          Add Division
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading divisions..." />
      ) : divisions.length === 0 ? (
        <div className="card p-6">
          <EmptyState
            icon={MdClass}
            title="No divisions yet"
            description="Create your first division to organise students."
            action={
              <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2">
                <MdAdd size={16} /> Add Division
              </button>
            }
          />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#3a3b42]">
                <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-5 py-3">Division Name</th>
                <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-5 py-3">Students</th>
                <th className="text-right px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a3b42]">
              {divisions.map(div => (
                <tr key={div.id} className="hover:bg-[#2e3038]/50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-100 font-medium">{div.name}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-sm">
                    {div.students?.[0]?.count ?? 0} students
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(div)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                        title="Edit"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(div)}
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

      <DivisionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        division={editDivision}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Division"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  )
}
