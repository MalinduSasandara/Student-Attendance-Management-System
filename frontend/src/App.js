import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import AttendanceList from './pages/AttendanceList';
import QrScannerPage from './pages/QrScannerPage';

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token');

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  if (!token) return null;

  return (
    <nav style={{ padding: '15px', background: '#333', color: '#fff', display: 'flex', gap: '20px' }}>
      <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
      <Link to="/students" style={{ color: '#fff', textDecoration: 'none' }}>Students</Link>
      <Link to="/scan" style={{ color: '#fff', textDecoration: 'none' }}>Scan QR</Link>
      <Link to="/attendances" style={{ color: '#fff', textDecoration: 'none' }}>Attendance Logs</Link>
      <button onClick={handleLogout} style={{ marginLeft: 'auto', cursor: 'pointer' }}>Logout</button>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/scan" element={<QrScannerPage />} />
        <Route path="/attendances" element={<AttendanceList />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;