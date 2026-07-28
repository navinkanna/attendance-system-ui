import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import RegisterClasses from './pages/RegisterClasses'
import RegisterStudents from './pages/RegisterStudents'
import AssignStudents from './pages/AssignStudents'
import RecordAttendance from './pages/RecordAttendance'
import ViewHistory from './pages/ViewHistory'
import './App.css'

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register-classes" element={<RegisterClasses />} />
          <Route path="/register-classes/:classId/students" element={<AssignStudents />} />
          <Route path="/register-students" element={<RegisterStudents />} />
          <Route path="/record-attendance" element={<RecordAttendance />} />
          <Route path="/view-history" element={<ViewHistory />} />
        </Routes>
      </main>
    </>
  )
}

export default App
