import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage({ updateUserStatus }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        navigate('/login-successful');
      }
    } catch (error) {
      setMessage('Error signing up. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>

      {/* Google Sign-In Button */}
      <div className="google-signin-container">
        <button
          className="google-signin-btn"
          onClick={() => window.location.href = 'http://localhost:5000/auth/google'}
        >
          <i className="fab fa-google"></i> Sign In with Google
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}

export default SignupPage;
