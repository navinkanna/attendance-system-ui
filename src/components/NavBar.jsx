import { NavLink } from 'react-router-dom'
import './NavBar.css'

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Attendance System</div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/register-classes" className={({ isActive }) => (isActive ? 'active' : '')}>
            Manage Class
          </NavLink>
        </li>
        <li>
          <NavLink to="/register-students" className={({ isActive }) => (isActive ? 'active' : '')}>
            Manage Students
          </NavLink>
        </li>
        <li>
          <NavLink to="/record-attendance" className={({ isActive }) => (isActive ? 'active' : '')}>
            Record Attendance
          </NavLink>
        </li>
        <li>
          <NavLink to="/view-history" className={({ isActive }) => (isActive ? 'active' : '')}>
            View History
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
