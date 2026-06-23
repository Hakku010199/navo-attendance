import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { useDivisions } from '../../hooks/useDivisions'

const MOBILE_RE = /^[1-9]\d{9}$/

// Field must be defined OUTSIDE the parent component so React does not
// treat it as a new component type on every render (which would unmount
// the input and steal focus after every keystroke).
function Field({ label, field, value, placeholder, type = 'text', error, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <input
        className="input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(field, e.target.value)}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function StudentModal({ isOpen, onClose, onSave, student = null }) {
  const { divisions } = useDivisions()
  const [form, setForm] = useState({ roll_number: '', name: '', mobile: '', division_id: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm(student
        ? { roll_number: student.roll_number, name: student.name, mobile: student.mobile, division_id: student.division_id }
        : { roll_number: '', name: '', mobile: '', division_id: divisions[0]?.id || '' }
      )
      setErrors({})
    }
  }, [isOpen, student, divisions])

  const validate = () => {
    const e = {}
    if (!form.roll_number.trim()) e.roll_number = 'Roll number is required.'
    if (!form.name.trim()) e.name = 'Student name is required.'
    if (!form.mobile.trim()) e.mobile = 'Mobile number is required.'
    else if (!MOBILE_RE.test(form.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number.'
    if (!form.division_id) e.division_id = 'Please select a division.'
    return e
  }

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await onSave(form, student?.id)
      onClose()
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={student ? 'Edit Student' : 'Add Student'}>
      <div className="flex flex-col gap-4">
        <Field
          label="Roll Number"
          field="roll_number"
          value={form.roll_number}
          placeholder="e.g. 1, 2, A01..."
          error={errors.roll_number}
          onChange={handleChange}
        />
        <Field
          label="Student Name"
          field="name"
          value={form.name}
          placeholder="Full name"
          error={errors.name}
          onChange={handleChange}
        />
        <Field
          label="Mobile Number"
          field="mobile"
          value={form.mobile}
          placeholder="10-digit mobile number"
          type="tel"
          error={errors.mobile}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Division</label>
          <select
            className="input"
            value={form.division_id}
            onChange={e => handleChange('division_id', e.target.value)}
          >
            <option value="">Select division...</option>
            {divisions.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {errors.division_id && <p className="text-red-400 text-xs mt-1">{errors.division_id}</p>}
        </div>

        {errors.general && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-1">
          <button onClick={onClose} className="btn-secondary text-sm" disabled={loading}>Cancel</button>
          <button onClick={handleSubmit} className="btn-primary text-sm" disabled={loading}>
            {loading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </div>
    </Modal>
  )
}