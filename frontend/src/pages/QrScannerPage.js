import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' or 'error'
  
  const scannerRef = useRef(null);
  const isSubmittingRef = useRef(false); // In-flight guard using ref to avoid closure staleness
  const cooldownRef = useRef(false);     // Cooldown guard
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(onScanSuccess, () => {});
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error(err));
      }
    };
  }, []);

  const onScanSuccess = async (decodedText) => {
    // Prevent multiple rapid-fire submissions while a request is in flight or during cooldown
    if (isSubmittingRef.current || cooldownRef.current) return;

    isSubmittingRef.current = true;
    setScanResult(decodedText);
    setStatusMessage('Processing scan...');
    setStatusType('info');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/attendances/scan', 
        { student_code: decodedText }, // Aligned with backend student_code validation
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setStatusMessage(response.data.message || 'Attendance recorded successfully!');
      setStatusType('success');

      // Trigger 3-second cooldown to prevent duplicate burst scans
      cooldownRef.current = true;
      setTimeout(() => {
        cooldownRef.current = false;
      }, 3000);

    } catch (error) {
      if (error.response?.status === 401) {
        setStatusMessage('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setStatusMessage(error.response?.data?.message || 'Failed to record attendance.');
      }
      setStatusType('error');
    } finally {
      isSubmittingRef.current = false;
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
        <Link to="/dashboard" style={{ color: '#555', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/students" style={{ color: '#555', textDecoration: 'none' }}>Students</Link>
        <Link to="/scan-qr" style={{ fontWeight: 'bold', color: '#000', textDecoration: 'none' }}>Scan QR</Link>
        <Link to="/attendances" style={{ color: '#555', textDecoration: 'none' }}>Attendance Logs</Link>
        <button onClick={handleLogout} style={{ marginLeft: 'auto', cursor: 'pointer' }}>Logout</button>
      </div>

      <h2>Live QR Code Scanner</h2>

      {statusMessage && (
        <p style={{ 
          fontWeight: 'bold', 
          padding: '10px', 
          background: statusType === 'success' ? '#d4edda' : statusType === 'error' ? '#f8d7da' : '#e2e3e5',
          color: statusType === 'success' ? '#155724' : statusType === 'error' ? '#721c24' : '#383d41',
          borderRadius: '4px',
          maxWidth: '500px'
        }}>
          {statusMessage}
        </p>
      )}

      <div id="qr-reader" style={{ maxWidth: '500px' }}></div>

      {scanResult && <p style={{ marginTop: '15px' }}><strong>Last Scanned Code:</strong> {scanResult}</p>}
    </div>
  );
};

export default QrScannerPage;