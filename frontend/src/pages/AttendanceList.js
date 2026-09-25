import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/attendances');
      setAttendances(response.data);
    } catch (error) {
      console.error('Error fetching attendances:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this record?')) {
      try {
        await axios.delete(`http://localhost:8000/api/attendances/${id}`);
        setAttendances(attendances.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredAttendances = attendances.filter(item => {
    const matchesSearch = 
      item.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student?.student_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? item.date === selectedDate : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Top Header Navigation Tabs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ color: '#555', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/students" style={{ color: '#555', textDecoration: 'none' }}>Students</Link>
        <Link to="/scan-qr" style={{ color: '#555', textDecoration: 'none' }}>Scan QR</Link>
        <Link to="/attendances" style={{ fontWeight: 'bold', color: '#000', textDecoration: 'none' }}>Attendance Logs</Link>
        <button onClick={handleLogout} style={{ marginLeft: 'auto', cursor: 'pointer' }}>Logout</button>
      </div>

      <h2>Attendance Records</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by student name or code..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
        />
      </div>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Student Code</th>
            <th>Student Name</th>
            <th>Status</th>
            <th>Scanned Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendances.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.time}</td>
              <td>{item.student?.student_code || 'N/A'}</td>
              <td>{item.student?.name || 'Unknown'}</td>
              <td>{item.status}</td>
              <td>{item.scanned_code}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;