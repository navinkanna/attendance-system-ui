import { useEffect, useMemo, useState } from 'react'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../api/studentApi'
import StudentFormModal from '../../components/StudentFormModal/StudentFormModal'
import { EditIcon, DeleteIcon } from '../../components/icons'

function RegisterStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalMode, setModalMode] = useState(null) // null | 'add' | student object being edited

  useEffect(() => {
    loadStudents()
  }, [])

  function loadStudents() {
    setLoading(true)
    setError(null)
    getStudents()
      .then(setStudents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  async function handleCreate(data) {
    const created = await createStudent(data)
    setStudents((prev) => [...prev, created])
    setModalMode(null)
  }

  async function handleUpdate(data) {
    const updated = await updateStudent(modalMode.id, data)
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setModalMode(null)
  }

  async function handleDelete(student) {
    if (!window.confirm(`Delete student "${student.first_name} ${student.last_name}"?`)) return
    try {
      await deleteStudent(student.id)
      setStudents((prev) => prev.filter((s) => s.id !== student.id))
    } catch (err) {
      window.alert(err.message)
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
        <h1>Manage Students</h1>
        <button type="button" className="btn btn-primary" onClick={() => setModalMode('add')}>
          + Add Student
        </button>
      </div>

      {loading && <p>Loading students…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && (
        <table className="class-grid">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-row">
                  No students registered yet.
                </td>
              </tr>
            )}
            {sortedStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.age}</td>
                <td className="actions-col">
                  <button
                    type="button"
                    className="icon-btn"
                    title="Edit student"
                    onClick={() => setModalMode(student)}
                  >
                    <EditIcon />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn-danger"
                    title="Delete student"
                    onClick={() => handleDelete(student)}
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalMode === 'add' && (
        <StudentFormModal onSubmit={handleCreate} onClose={() => setModalMode(null)} />
      )}
      {modalMode && modalMode !== 'add' && (
        <StudentFormModal
          initialData={modalMode}
          onSubmit={handleUpdate}
          onClose={() => setModalMode(null)}
        />
      )}
    </section>
  )
}

export default RegisterStudents
