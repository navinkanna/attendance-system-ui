const API_BASE = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')

async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail || `Request failed with status ${response.status}`)
  }
  return response.json()
}

export function getRegisteredStudents(classId) {
  return fetch(`${API_BASE}/classes/${classId}/students`).then(handleResponse)
}

export function replaceRegisteredStudents(classId, studentIds) {
  return fetch(`${API_BASE}/classes/${classId}/students`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_ids: studentIds }),
  }).then(handleResponse)
}
