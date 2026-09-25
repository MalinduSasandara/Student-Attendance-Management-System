import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AttendanceList = () => {
  const [logs, setLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('');

  useEffect(() => {
    fetchLogs();
    fetchStudents();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/attendances');
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/students');
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleFilterChange = async (studentId) => {
    setSelectedStudentFilter(studentId);
    if (studentId === '') {
      fetchLogs();
    } else {
      try {
        const res = await axios.get(`http://localhost:8000/api/attendances/student/${studentId}`);
        setLogs(res.data);
      } catch (error) {
        console.error('Error filtering logs:', error);
      }
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    try {
      await axios.put(`http://localhost:8000/api/attendances/${id}`, { status: newStatus });
      if (selectedStudentFilter) {
        handleFilterChange(selectedStudentFilter);
      } else {
        fetchLogs();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this attendance record?')) {
      try {
        await axios.delete(`http://localhost:8000/api/attendances/${id}`);
        if (selectedStudentFilter) {
          handleFilterChange(selectedStudentFilter);
        } else {
          fetchLogs();
        }
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/students">Students</Link>
        <Link to="/scan-qr">Scan QR</Link>
        <Link to="/attendances"><b>Attendance Logs</b></Link>
      </div>

      <h2>Attendance Logs</h2>

      {/* Filter by Student */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Filter by Student:</label>
        <select value={selectedStudentFilter} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="">All Students</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.student_code})</option>
          ))}
        </select>
      </div>

      {/* Attendance Records Table */}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Code</th>
            <th>Student Name</th>
            <th>Status</th>
            <th>Scanned At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.student?.student_code || 'N/A'}</td>
                <td>{log.student?.name || 'N/A'}</td>
                <td>{log.status}</td>
                <td>{new Date(log.scanned_at || log.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleStatusUpdate(log.id, log.status)}>Toggle Status</button>{' '}
                  <button onClick={() => handleDelete(log.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No attendance records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;