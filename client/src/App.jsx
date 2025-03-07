import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import WelcomePage from './Pages/WelcomePage';
import SignupSuccessful from './Pages/SignupSuccessful';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import PrivateProfile from './Pages/PrivateProfile';
import PublicProfile from './Pages/PublicProfile';

function App() {
  // User authentication state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check user status
  const checkUserStatus = async () => {
    setError('');
    setLoading(true); // Set loading while fetching

    try {
      const response = await fetch('http://localhost:5000/session-data', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user || null);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Failed to authenticate user from session.', error);
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false); // Finish loading after fetch attempt
    }
  };

  // Run checkUserStatus on load
  useEffect(() => {
    checkUserStatus();
  }, []);

  // Show loading message while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Redirect logic AFTER loading */}
      <Route path="/" element={user ? <Navigate to="/profile" /> : <Navigate to="/welcome" />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage user={user} updateUserStatus={checkUserStatus} />} />
      <Route path="/register" element={<SignupPage user={user} />} />
      <Route path="/signup-successful" element={<SignupSuccessful />} />
      <Route path="/profile" element={<PrivateProfile user={user} />} />
      <Route path="/user/:username" element={<PublicProfile user={user} />} />
    </Routes>
  );
}

export default App;
