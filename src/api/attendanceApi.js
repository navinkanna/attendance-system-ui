const API_BASE = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')

async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail || `Request failed with status ${response.status}`)
  }
  return response.json()
}

export function getTodaysAttendance(classId) {
  return fetch(`${API_BASE}/classes/${classId}/attendance`).then(handleResponse)
}

export function saveTodaysAttendance(classId, records) {
  return fetch(`${API_BASE}/classes/${classId}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records }),
  }).then(handleResponse)
}

export function getAttendanceDates(classId) {
  return fetch(`${API_BASE}/classes/${classId}/attendance/dates`).then(handleResponse)
}

export function getAttendanceHistory(classId, date) {
  return fetch(`${API_BASE}/classes/${classId}/attendance/history?date=${date}`).then(
    handleResponse
  )
}
