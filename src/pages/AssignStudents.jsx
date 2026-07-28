import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getClassById } from '../api/classApi'
import { getStudents } from '../api/studentApi'
import { getRegisteredStudents, replaceRegisteredStudents } from '../api/classRegistrationApi'
import '../components/ClassFormModal.css'
import './RegisterClasses.css'
import './AssignStudents.css'

function AssignStudents() {
  const { classId } = useParams()
  const navigate = useNavigate()

  const [schoolClass, setSchoolClass] = useState(null)
  const [students, setStudents] = useState([])
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      getClassById(classId),
      getStudents(),
      getRegisteredStudents(classId),
    ])
      .then(([cls, allStudents, registered]) => {
        setSchoolClass(cls)
        setStudents(allStudents)
        setSelectedIds(new Set(registered.map((s) => s.id)))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [classId])

  function toggleStudent(studentId) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(studentId)) {
        next.delete(studentId)
      } else {
        next.add(studentId)
      }
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await replaceRegisteredStudents(classId, [...selectedIds])
      navigate('/register-classes')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const sortedStudents = useMemo(
    () =>
      [...students].sort(
        (a, b) =>
          a.first_name.localeCompare(b.first_name) || a.last_name.localeCompare(b.last_name)
      ),
    [students]
  )

  return (
    <section className="page">
      <div className="page-header">
        <h1>
          Add Students{schoolClass ? ` — ${schoolClass.classname} ${schoolClass.section}` : ''}
        </h1>
      </div>

      {loading && <p>Loading students…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && (
        <>
          <ul className="student-checklist">
            {sortedStudents.length === 0 && <li className="empty-row">No students registered yet.</li>}
            {sortedStudents.map((student) => (
              <li key={student.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(student.id)}
                    onChange={() => toggleStudent(student.id)}
                  />
                  {student.first_name} {student.last_name}
                </label>
              </li>
            ))}
          </ul>

          <div className="assign-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/register-classes')}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default AssignStudents
