import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    total_attendance_records: 0,
    today_attendance_count: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Top Header Navigation Tabs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ fontWeight: 'bold', color: '#000', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/students" style={{ color: '#555', textDecoration: 'none' }}>Students</Link>
        <Link to="/scan-qr" style={{ color: '#555', textDecoration: 'none' }}>Scan QR</Link>
        <Link to="/attendances" style={{ color: '#555', textDecoration: 'none' }}>Attendance Logs</Link>
        <button onClick={handleLogout} style={{ marginLeft: 'auto', cursor: 'pointer' }}>Logout</button>
      </div>

      <h2>Admin Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
          <h4>Total Students</h4>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_students}</span>
        </div>

        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
          <h4>Total Attendance Records</h4>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_attendance_records}</span>
        </div>

        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
          <h4>Today's Attendance</h4>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.today_attendance_count}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;