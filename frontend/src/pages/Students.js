import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ student_code: '', name: '', email: '', phone: '', qr_code: '' });
  const [editingId, setEditingId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Error and feedback states
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => { 
    fetchStudents(); 
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/students', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setStudents(res.data);
    } catch (err) {
      setGeneralError('Failed to fetch students.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${getToken()}` } };
      if (editingId) {
        await axios.put(`http://localhost:8000/api/students/${editingId}`, formData, config);
        setSuccessMessage('Student updated successfully!');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:8000/api/students', formData, config);
        setSuccessMessage('Student created successfully!');
      }
      setFormData({ student_code: '', name: '', email: '', phone: '', qr_code: '' });
      fetchStudents();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setFieldErrors(error.response.data.errors || {});
          setGeneralError('Please correct the validation errors below.');
        } else {
          setGeneralError(error.response.data.message || 'An error occurred on the server.');
        }
      } else {
        setGeneralError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false); // Form state remains intact if an error occurs
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      student_code: student.student_code,
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      qr_code: student.qr_code || '',
    });
    setFieldErrors({});
    setGeneralError('');
    setSuccessMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this student?')) {
      try {
        await axios.delete(`http://localhost:8000/api/students/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setSuccessMessage('Student deleted successfully!');
        fetchStudents();
      } catch (err) {
        setGeneralError('Failed to delete student.');
      }
    }
  };

  const handleViewSingle = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setSelectedStudent(res.data);
    } catch (err) {
      setGeneralError('Failed to load student details.');
    }
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

      {/* Success & Error Banners */}
      {successMessage && (
        <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '4px' }}>
          {successMessage}
        </div>
      )}
      {generalError && (
        <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', marginBottom: '15px', borderRadius: '4px' }}>
          {generalError}
        </div>
      )}

      {/* Create / Edit Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxWidth: '400px' }}>
        <div>
          <input placeholder="Student Code" value={formData.student_code} onChange={e => setFormData({...formData, student_code: e.target.value})} style={{ width: '100%', padding: '8px' }} />
          {fieldErrors.student_code && <span style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.student_code[0]}</span>}
        </div>
        <div>
          <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px' }} />
          {fieldErrors.name && <span style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.name[0]}</span>}
        </div>
        <div>
          <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '8px' }} />
          {fieldErrors.email && <span style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.email[0]}</span>}
        </div>
        <div>
          <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '8px' }} />
          {fieldErrors.phone && <span style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.phone[0]}</span>}
        </div>
        <div>
          <input placeholder="QR Code" value={formData.qr_code} onChange={e => setFormData({...formData, qr_code: e.target.value})} style={{ width: '100%', padding: '8px' }} />
          {fieldErrors.qr_code && <span style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.qr_code[0]}</span>}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 15px' }}>
            {loading ? 'Saving...' : (editingId ? 'Update Student' : 'Add Student')}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({ student_code: '', name: '', email: '', phone: '', qr_code: '' }); setFieldErrors({}); }} style={{ padding: '8px 15px' }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Single View Details Panel */}
      {selectedStudent && (
        <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', marginBottom: '20px', maxWidth: '400px' }}>
          <h3>Student Details (Single View)</h3>
          <p><b>Code:</b> {selectedStudent.student_code}</p>
          <p><b>Name:</b> {selectedStudent.name}</p>
          <p><b>Email:</b> {selectedStudent.email}</p>
          <p><b>Phone:</b> {selectedStudent.phone || 'N/A'}</p>
          <p><b>QR Code:</b> {selectedStudent.qr_code}</p>
          <button onClick={() => setSelectedStudent(null)}>Close</button>
        </div>
      )}

      {/* Student List Table */}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Student Code</th><th>Name</th><th>Email</th><th>Phone</th><th>QR Code</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.student_code}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.qr_code}</td>
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