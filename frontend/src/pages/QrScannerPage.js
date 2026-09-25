import React, { useState } from 'react';
import API from '../api/axiosInstance';

const QrScannerPage = () => {
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await API.post('/attendances/scan', { qr_code: qrCode });
      setMessage(`${response.data.message} (${response.data.data.student.name})`);
      setQrCode('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error marking attendance');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Scan Student QR / Barcode</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleScan}>
        <input
          type="text"
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
          placeholder="Scan or enter QR code value..."
          autoFocus
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>Mark Attendance</button>
      </form>
    </div>
  );
};

export default QrScannerPage;