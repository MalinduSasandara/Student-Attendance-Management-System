import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student_code: '', name: '', email: '', phone: '', qr_code: '', status: 'active' });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = () => {
    API.get('/students').then((res) => setStudents(res.data));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await API.put(`/students/${editingId}`, form);
    } else {
      await API.post('/students', form);
    }
    setForm({ student_code: '', name: '', email: '', phone: '', qr_code: '', status: 'active' });
    setEditingId(null);
    fetchStudents();
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setForm(student);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this student?')) {
      await API.delete(`/students/${id}`);
      fetchStudents();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input placeholder="Student ID Code" value={form.student_code} onChange={(e) => setForm({ ...form, student_code: e.target.value })} required />
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input placeholder="QR Code Value" value={form.qr_code} onChange={(e) => setForm({ ...form, qr_code: e.target.value })} required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Student</button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>QR Value</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.student_code}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.qr_code}</td>
              <td>{s.status}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)} style={{ marginLeft: '5px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;