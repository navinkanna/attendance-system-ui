import { useEffect, useState } from 'react'
import { getClasses } from '../api/classApi'
import { getAttendanceDates, getAttendanceHistory } from '../api/attendanceApi'
import '../components/ClassFormModal.css'
import './RegisterClasses.css'
import './RecordAttendance.css'
import './AssignStudents.css'

function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function ViewHistory() {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [dates, setDates] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [viewing, setViewing] = useState(false)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getClasses()
      .then(setClasses)
      .catch((err) => setError(err.message))
  }, [])

  function handleClassChange(classId) {
    setSelectedClassId(classId)
    setSelectedDate('')
    setViewing(false)
    setDates([])
    if (!classId) return
    getAttendanceDates(classId)
      .then(setDates)
      .catch((err) => setError(err.message))
  }

  async function handleViewAttendance() {
    if (!selectedClassId || !selectedDate) return
    setLoading(true)
    setError(null)
    try {
      const entries = await getAttendanceHistory(selectedClassId, selectedDate)
      setHistory(entries)
      setViewing(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1>View History</h1>
      </div>

      {!viewing && (
        <div className="class-picker">
          <label htmlFor="history-class-select">Select Class</label>
          <select
            id="history-class-select"
            value={selectedClassId}
            onChange={(e) => handleClassChange(e.target.value)}
          >
            <option value="">-- Choose a class --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.classname} - {cls.section}
              </option>
            ))}
          </select>

          <label htmlFor="history-date-select">Select Date</label>
          <select
            id="history-date-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={!selectedClassId}
          >
            <option value="">-- Choose a date --</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-primary"
            disabled={!selectedClassId || !selectedDate || loading}
            onClick={handleViewAttendance}
          >
            {loading ? 'Loading…' : 'View Attendance'}
          </button>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      {viewing && (
        <>
          <p className="attendance-date">{formatDate(selectedDate)}</p>

          <table className="class-grid">
            <thead>
              <tr>
                <th>Student</th>
                <th className="actions-col">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td colSpan={2} className="empty-row">
                    No attendance records found.
                  </td>
                </tr>
              )}
              {history.map((entry) => (
                <tr key={entry.student_id}>
                  <td>
                    {entry.first_name} {entry.last_name}
                  </td>
                  <td className="actions-col">
                    <span
                      className={`attendance-btn present ${entry.is_present ? 'filled' : ''}`}
                    >
                      Present
                    </span>
                    <span
                      className={`attendance-btn absent ${!entry.is_present ? 'filled' : ''}`}
                    >
                      Absent
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="assign-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setViewing(false)}>
              Back
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default ViewHistory
