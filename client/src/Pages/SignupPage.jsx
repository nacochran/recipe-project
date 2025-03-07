import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage({ user }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showResendForm, setShowResendForm] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setShowVerification(true);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error signing up. Please try again.');
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationCode }),
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        setMessage(data.message);
        setShowVerification(false);
        navigate('/signup-successful');
      } else {
        setError(data.error);
        if (data.err_code === 'invalid_code') {
          setShowResendForm(true);
        }
      }
    } catch (error) {
      setError('Error verifying code. Please try again.');
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setShowVerification(true);
        setShowResendForm(false);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error resending verification. Please try again.');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>

      {!showVerification && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      )}

      {showVerification && (
        <form onSubmit={handleVerification}>
          <div>
            <label>Verification Code:</label>
            <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required maxLength="6" />
          </div>
          <button type="submit">Verify</button>
        </form>
      )}

      {showResendForm && (
        <form onSubmit={handleResendVerification}>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit">Resend Verification Code</button>
        </form>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
}

export default SignupPage;
