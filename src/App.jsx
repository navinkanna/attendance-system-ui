import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import Home from './pages/Home/Home'
import RegisterClasses from './pages/RegisterClasses/RegisterClasses'
import RegisterStudents from './pages/RegisterStudents/RegisterStudents'
import AssignStudents from './pages/AssignStudents/AssignStudents'
import RecordAttendance from './pages/RecordAttendance/RecordAttendance'
import ViewHistory from './pages/ViewHistory/ViewHistory'
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
