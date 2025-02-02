import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UserProfile({ user }) {
  // TODO: implement /username as private view and /users/username as public view

  const { username } = useParams();

  // Show loading screen...
  if (!user) {
    return <p>Loading profile...</p>;
  }
  else {
    const profileView = (user.username == username) ? 'personal' : 'public';

    return (
      <div>
        <h1>User Profile</h1>
        <p>Welcome, {username}!</p>
        <p>This is a {profileView} profile view.</p>
      </div>
    );
  }
}

export default UserProfile;
