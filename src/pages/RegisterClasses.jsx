import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClasses, createClass, updateClass, deleteClass } from '../api/classApi'
import ClassFormModal from '../components/ClassFormModal'
import { EditIcon, AddStudentsIcon, DeleteIcon } from '../components/icons'
import './RegisterClasses.css'

function RegisterClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalMode, setModalMode] = useState(null) // null | 'add' | class object being edited
  const navigate = useNavigate()

  useEffect(() => {
    loadClasses()
  }, [])

  function loadClasses() {
    setLoading(true)
    setError(null)
    getClasses()
      .then(setClasses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  async function handleCreate(data) {
    const created = await createClass(data)
    setClasses((prev) => [...prev, created])
    setModalMode(null)
  }

  async function handleUpdate(data) {
    const updated = await updateClass(modalMode.id, data)
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    setModalMode(null)
  }

  async function handleDelete(cls) {
    if (!window.confirm(`Delete class "${cls.classname} - ${cls.section}"?`)) return
    try {
      await deleteClass(cls.id)
      setClasses((prev) => prev.filter((c) => c.id !== cls.id))
    } catch (err) {
      window.alert(err.message)
    }
  }

  function handleAddStudents(cls) {
    navigate(`/register-students?classId=${cls.id}`)
  }

  const sortedClasses = useMemo(
    () =>
      [...classes].sort(
        (a, b) =>
          a.classname.localeCompare(b.classname) || a.section.localeCompare(b.section)
      ),
    [classes]
  )

  return (
    <section className="page">
      <div className="page-header">
        <h1>Register Classes</h1>
        <button type="button" className="btn btn-primary" onClick={() => setModalMode('add')}>
          + Add Class
        </button>
      </div>

      {loading && <p>Loading classes…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && (
        <table className="class-grid">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Section</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedClasses.length === 0 && (
              <tr>
                <td colSpan={3} className="empty-row">
                  No classes registered yet.
                </td>
              </tr>
            )}
            {sortedClasses.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.classname}</td>
                <td>{cls.section}</td>
                <td className="actions-col">
                  <button
                    type="button"
                    className="icon-btn"
                    title="Edit class"
                    onClick={() => setModalMode(cls)}
                  >
                    <EditIcon />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Add students"
                    onClick={() => handleAddStudents(cls)}
                  >
                    <AddStudentsIcon />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn-danger"
                    title="Delete class"
                    onClick={() => handleDelete(cls)}
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
        <ClassFormModal onSubmit={handleCreate} onClose={() => setModalMode(null)} />
      )}
      {modalMode && modalMode !== 'add' && (
        <ClassFormModal
          initialData={modalMode}
          onSubmit={handleUpdate}
          onClose={() => setModalMode(null)}
        />
      )}
    </section>
  )
}

export default RegisterClasses
