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
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600">Login</h1>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {message && <p className="text-green-500 mt-2">{message}</p>}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* Resend Verification Form (only shows if needed) */}
        {showResendForm && (
          <form onSubmit={handleResendVerification} className="space-y-4 mt-6">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Resend Verification Email
            </button>
          </form>
        )}

        {/* Verification Form (only shows if needed) */}
        {showVerificationForm && (
          <form onSubmit={handleVerification} className="space-y-4 mt-6">
            <div>
              <input
                type="text"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                maxLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
