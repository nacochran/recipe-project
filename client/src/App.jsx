import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import WelcomePage from './Pages/WelcomePage';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import UserProfile from './Pages/UserProfile';

function App() {
  // Placeholder user authentication
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkUserStatus = async (e) => {
    // console.log("How many times..."); 
    // TODO: Double check why this appears to be running twice
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

      //console.log("Testing Session data: ", data);

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
      {/* Redirect to /welcome if not logged in, otherwise to the profile */}
      <Route path="/" element={(user != null) ? <Navigate to={`/user/${user.username}`} /> : <Navigate to="/welcome" />} />

      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Dynamic route for user profiles */}
      <Route path="/user/:username" element={<UserProfile user={user} />} />
    </Routes>
  );
}

export default App;
