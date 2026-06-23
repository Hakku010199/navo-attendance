import { useState, useEffect } from 'react'
import Modal from '../common/Modal'

export default function DivisionModal({ isOpen, onClose, onSave, division = null }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setName(division?.name || '')
      setError('')
    }
  }, [isOpen, division])

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Division name is required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onSave(name.trim(), division?.id)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={division ? 'Edit Division' : 'Add Division'}
      size="sm"
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Division Name</label>
          <input
            className="input"
            placeholder="e.g. Class A, Grade 5B..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary text-sm" disabled={loading}>Cancel</button>
          <button onClick={handleSubmit} className="btn-primary text-sm" disabled={loading}>
            {loading ? 'Saving...' : 'Save Division'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
