import { useState } from 'react'

function ClassFormModal({ initialData, onSubmit, onClose }) {
  const [classname, setClassname] = useState(initialData?.classname ?? '')
  const [section, setSection] = useState(initialData?.section ?? '')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const isEdit = Boolean(initialData)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit({ classname: classname.trim(), section: section.trim() })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit Class' : 'Add Class'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Class Name
            <input
              type="text"
              value={classname}
              onChange={(e) => setClassname(e.target.value)}
              required
              autoFocus
            />
          </label>
          <label>
            Section
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
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

export default ClassFormModal
