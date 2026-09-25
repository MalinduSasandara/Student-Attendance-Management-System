import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ student_code: '', name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:8000/api/students');
    setStudents(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:8000/api/students/${editingId}`, formData);
      setEditingId(null);
    } else {
      await axios.post('http://localhost:8000/api/students', formData);
    }
    setFormData({ student_code: '', name: '', email: '', phone: '' });
    fetchStudents();
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      student_code: student.student_code,
      name: student.name,
      email: student.email,
      phone: student.phone || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this student?')) {
      await axios.delete(`http://localhost:8000/api/students/${id}`);
      fetchStudents();
    }
  };

  const handleViewSingle = async (id) => {
    const res = await axios.get(`http://localhost:8000/api/students/${id}`);
    setSelectedStudent(res.data);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/students"><b>Students</b></Link>
        <Link to="/scan-qr">Scan QR</Link>
        <Link to="/attendances">Attendance Logs</Link>
      </div>

      <h2>Student Management</h2>

      {/* Create / Edit Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Student Code" value={formData.student_code} onChange={e => setFormData({...formData, student_code: e.target.value})} required />
        <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        <button type="submit">{editingId ? 'Update Student' : 'Add Student'}</button>
        {editingId && <button onClick={() => { setEditingId(null); setFormData({ student_code: '', name: '', email: '', phone: '' }); }}>Cancel</button>}
      </form>

      {/* Single View Details Modal/Panel */}
      {selectedStudent && (
        <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <h3>Student Details (Single View)</h3>
          <p><b>Code:</b> {selectedStudent.student_code}</p>
          <p><b>Name:</b> {selectedStudent.name}</p>
          <p><b>Email:</b> {selectedStudent.email}</p>
          <p><b>Phone:</b> {selectedStudent.phone || 'N/A'}</p>
          <button onClick={() => setSelectedStudent(null)}>Close</button>
        </div>
      )}

      {/* Student List Table */}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Student Code</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.student_code}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>
                <button onClick={() => handleViewSingle(s.id)}>View</button>{' '}
                <button onClick={() => handleEdit(s)}>Edit</button>{' '}
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;