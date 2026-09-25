import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#1f2937',
      padding: '12px 24px',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
        Student Attendance System
      </div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/students" style={{ color: '#fff', textDecoration: 'none' }}>Students</Link>
        <Link to="/scan-qr" style={{ color: '#fff', textDecoration: 'none' }}>Scan QR</Link>
        <Link to="/attendances" style={{ color: '#fff', textDecoration: 'none' }}>Attendance Logs</Link>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;