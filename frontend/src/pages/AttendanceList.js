import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    API.get('/attendances').then((res) => setAttendances(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete attendance record?')) {
      await API.delete(`/attendances/${id}`);
      setAttendances(attendances.filter((item) => item.id !== id));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Attendance Records</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
          {attendances.map((a) => (
            <tr key={a.id}>
              <td>{a.date}</td>
              <td>{a.time}</td>
              <td>{a.student?.student_code || 'N/A'}</td>
              <td>{a.student?.name || 'N/A'}</td>
              <td>{a.status}</td>
              <td>{a.scanned_code}</td>
              <td>
                <button onClick={() => handleDelete(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;