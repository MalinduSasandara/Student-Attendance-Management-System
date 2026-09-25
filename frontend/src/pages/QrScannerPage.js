import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const scannerRef = useRef(null);
  const navigate = useNavigate();

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
    setScanResult(decodedText);
    try {
      const response = await axios.post('http://localhost:8000/api/attendances/scan', {
        qr_code: decodedText,
      });
      setStatusMessage(response.data.message || 'Attendance recorded!');
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Failed to record attendance.');
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

      {statusMessage && <p style={{ fontWeight: 'bold' }}>{statusMessage}</p>}

      <div id="qr-reader" style={{ maxWidth: '500px' }}></div>

      {scanResult && <p><strong>Last Scanned:</strong> {scanResult}</p>}
    </div>
  );
};

export default QrScannerPage;