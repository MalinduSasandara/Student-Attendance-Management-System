import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';

const Dashboard = () => {
  const [stats, setStats] = useState({ total_students: 0, total_attendance_records: 0, today_attendance_count: 0 });

  useEffect(() => {
    API.get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1, padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3>Total Students</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_students}</p>
        </div>
        <div style={{ flex: 1, padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3>Total Attendance Records</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_attendance_records}</p>
        </div>
        <div style={{ flex: 1, padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3>Today's Attendance</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.today_attendance_count}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;