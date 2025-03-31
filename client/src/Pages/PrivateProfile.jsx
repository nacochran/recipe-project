import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PrivateProfile({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        navigate('/welcome');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Show loading screen...
  return (
    <div>
      <h1>User Profile</h1>
      <p>Welcome to your personal profile, {user.username}!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default PrivateProfile;
