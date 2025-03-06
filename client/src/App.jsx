import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import WelcomePage from './Pages/WelcomePage';
import SignupSuccessful from './Pages/SignupSuccessful';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import PrivateProfile from './Pages/PrivateProfile';
import PublicProfile from './Pages/PublicProfile';

function App() {
  // Placeholder user authentication
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // updates status
  const checkUserStatus = async (e) => {
    setError('');

    try {
      const response = await fetch('http://localhost:5000/session-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }

      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Failed to authenticate user from session.', error);
      setError('Failed to connect to the server.');
    }
  };

  // run @checkUserStatus on load
  useEffect(() => {
    checkUserStatus();
  }, []);

  return (
    <Routes>
      {/* Redirect to /welcome */}
      <Route path="/" element={<Navigate to="/welcome" />} />

      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage updateUserStatus={checkUserStatus} />} />
      <Route path="/register" element={<SignupPage updateUserStatus={checkUserStatus} />} />
      <Route path="login-successful" element={<SignupSuccessful />} />
      <Route path="/profile" element={<PrivateProfile user={user} />} />

      {/* Dynamic route for public user profiles */}
      <Route path="/user/:username" element={<PublicProfile />} />
    </Routes>
  );
}

export default App;
