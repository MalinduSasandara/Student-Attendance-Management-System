import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AttendanceList from './pages/AttendanceList';
import QrScannerPage from './pages/QrScannerPage';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/students" 
          element={isAuthenticated() ? <Students /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/attendances" 
          element={isAuthenticated() ? <AttendanceList /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/scan-qr" 
          element={isAuthenticated() ? <QrScannerPage /> : <Navigate to="/login" />} 
        />

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;