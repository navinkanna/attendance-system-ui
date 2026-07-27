import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import RegisterClasses from './pages/RegisterClasses'
import RegisterStudents from './pages/RegisterStudents'
import RecordAttendance from './pages/RecordAttendance'
import './App.css'

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register-classes" element={<RegisterClasses />} />
          <Route path="/register-students" element={<RegisterStudents />} />
          <Route path="/record-attendance" element={<RecordAttendance />} />
        </Routes>
      </main>
    </>
  )
}

export default App
