import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_code: '',
    name: '',
    email: '',
    phone: '',
    qr_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'student_code') {
      setFormData({ ...formData, student_code: value, qr_code: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:8000/api/students', formData);
      setMessage('Student added successfully!');
      setFormData({ student_code: '', name: '', email: '', phone: '', qr_code: '' });
      fetchStudents();
    } catch (error) {
      setMessage('Failed to add student.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (studentCode) => {
    const printContent = document.getElementById(`qr-${studentCode}`).outerHTML;
    const win = window.open('', '', 'width=400,height=400');
    win.document.write(`
      <html>
        <head><title>Print QR - ${studentCode}</title></head>
        <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh;">
          <h2>${studentCode}</h2>
          ${printContent}
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    win.document.close();
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
        <Link to="/dashboard" style={{ color: '#555', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/students" style={{ fontWeight: 'bold', color: '#000', textDecoration: 'none' }}>Students</Link>
        <Link to="/scan-qr" style={{ color: '#555', textDecoration: 'none' }}>Scan QR</Link>
        <Link to="/attendances" style={{ color: '#555', textDecoration: 'none' }}>Attendance Logs</Link>
        <button onClick={handleLogout} style={{ marginLeft: 'auto', cursor: 'pointer' }}>Logout</button>
      </div>

      <h2>Student Management</h2>

      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input type="text" name="student_code" placeholder="Student ID Code" value={formData.student_code} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Student'}</button>
      </form>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Student Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>QR Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.student_code}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td>
                <div id={`qr-${student.student_code}`}>
                  <QRCodeSVG value={student.qr_code || student.student_code} size={80} />
                </div>
              </td>
              <td>
                <button onClick={() => handlePrint(student.student_code)}>Print QR</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;