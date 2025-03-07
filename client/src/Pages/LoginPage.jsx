import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ user, updateUserStatus }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [showResendForm, setShowResendForm] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        updateUserStatus();
        navigate('/profile');
      } else {
        setError(data.error);
        if (data.err_code === 'not_verified') {
          setShowResendForm(true);
        }
      }
    } catch (error) {
      console.error('Login request failed:', error);
      setError('Failed to connect to the server.');
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

      if (data.error) {
        setError(data.error);
        if (data.err_code === 'invalid_code') {
          setShowResendForm(true);
          setVerificationCode('');
        }
      } else {
        setMessage(data.message);
        setShowVerificationForm(false);
        setShowResendForm(false);
      }
    } catch (error) {
      console.error('Verification request failed:', error);
      setError('Failed to connect to the server.');
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

      if (data.error) {
        setError(data.error);
      } else {
        setMessage(data.message);
        setShowVerificationForm(true);
        setShowResendForm(false);
      }
    } catch (error) {
      console.error('Resend verification request failed:', error);
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {/* Login Form */}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>

      {/* Resend Verification Form (only shows if needed) */}
      {showResendForm && (
        <form onSubmit={handleResendVerification}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <button type="submit">Resend Verification Email</button>
        </form>
      )}

      {/* Verification Form (only shows if needed) */}
      {showVerificationForm && (
        <form onSubmit={handleVerification}>
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            maxLength="6"
          />
          <br />
          <button type="submit">Verify</button>
        </form>
      )}
    </div>
  );
}

export default LoginPage;
