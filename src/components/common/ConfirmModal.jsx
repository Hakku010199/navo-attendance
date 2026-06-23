import Modal from './Modal'
import { MdWarning } from 'react-icons/md'

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-red-500/10 text-red-400 mt-0.5">
          <MdWarning size={20} />
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
      </div>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary text-sm" disabled={loading}>
          Cancel
        </button>
        <button onClick={onConfirm} className="btn-danger text-sm" disabled={loading}>
          {loading ? 'Deleting...' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
