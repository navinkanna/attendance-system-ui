import { useState } from 'react'

function StudentFormModal({ initialData, onSubmit, onClose }) {
  const [firstName, setFirstName] = useState(initialData?.first_name ?? '')
  const [lastName, setLastName] = useState(initialData?.last_name ?? '')
  const [age, setAge] = useState(initialData?.age ?? '')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const isEdit = Boolean(initialData)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        age: Number(age),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit Student' : 'Add Student'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            First Name
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoFocus
            />
          </label>
          <label>
            Last Name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          <label>
            Age
            <input
              type="number"
              min="0"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentFormModal
