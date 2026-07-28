import { useEffect, useState } from 'react'
import { getClasses } from '../../api/classApi'
import { getRegisteredStudents } from '../../api/classRegistrationApi'
import { getTodaysAttendance, saveTodaysAttendance } from '../../api/attendanceApi'

const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

function RecordAttendance() {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [started, setStarted] = useState(false)
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({}) // studentId -> true | false
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getClasses()
      .then(setClasses)
      .catch((err) => setError(err.message))
  }, [])

  async function handleStartAttendance() {
    if (!selectedClassId) return
    setLoading(true)
    setError(null)
    try {
      const [registeredStudents, existingAttendance] = await Promise.all([
        getRegisteredStudents(selectedClassId),
        getTodaysAttendance(selectedClassId),
      ])
      const initialAttendance = {}
      for (const record of existingAttendance) {
        initialAttendance[record.student_id] = record.is_present
      }
      setStudents(registeredStudents)
      setAttendance(initialAttendance)
      setStarted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function markAttendance(studentId, isPresent) {
    setAttendance((prev) => ({ ...prev, [studentId]: isPresent }))
  }

  const allMarked = students.length > 0 && students.every((s) => attendance[s.id] !== undefined)

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const records = students.map((s) => ({
        student_id: s.id,
        is_present: attendance[s.id],
      }))
      await saveTodaysAttendance(selectedClassId, records)
      window.alert('Attendance saved.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1>Record Attendance</h1>
      </div>

      {!started && (
        <div className="class-picker">
          <label htmlFor="class-select">Select Class</label>
          <select
            id="class-select"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="">-- Choose a class --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.classname} - {cls.section}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!selectedClassId || loading}
            onClick={handleStartAttendance}
          >
            {loading ? 'Loading…' : 'Start Attendance'}
          </button>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      {started && (
        <>
          <p className="attendance-date">{today}</p>

          <table className="class-grid">
            <thead>
              <tr>
                <th>Student</th>
                <th className="actions-col">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr>
                  <td colSpan={2} className="empty-row">
                    No students registered to this class.
                  </td>
                </tr>
              )}
              {students.map((student) => {
                const status = attendance[student.id]
                return (
                  <tr key={student.id}>
                    <td>
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="actions-col">
                      <button
                        type="button"
                        className={`attendance-btn present ${status === true ? 'filled' : ''}`}
                        onClick={() => markAttendance(student.id, true)}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        className={`attendance-btn absent ${status === false ? 'filled' : ''}`}
                        onClick={() => markAttendance(student.id, false)}
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="assign-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStarted(false)}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!allMarked || saving}
              onClick={handleSave}
              title={!allMarked ? 'Mark attendance for every student first' : undefined}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default RecordAttendance
