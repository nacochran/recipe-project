import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserProfile from './pages/UserProfile';

function App() {
  // Placeholder user authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState();
  const navigate = useNavigate();

  const handleLogin = (u) => {
    // TODO: Handle cookies
    setIsLoggedIn(true);
    setUsername(u);
    navigate(`/user/${u}`);
  };

  return (
    <Routes>
      {/* Redirect to /welcome if not logged in, otherwise to the profile */}
      <Route path="/" element={isLoggedIn ? <Navigate to={`/user/${username}`} /> : <Navigate to="/welcome" />} />

      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Dynamic route for user profiles */}
      <Route path="/user/:username" element={<UserProfile />} />
    </Routes>
  );
}

export default App;
