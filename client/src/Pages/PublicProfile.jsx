import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PublicProfile({ user }) {
  const { username } = useParams(); // Extract username from URL
  const [publicUser, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${username}`);
        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          setError(data.message || 'User not found');
        }
      } catch (err) {
        setError('Error fetching user profile');
      }
    };

    fetchUserProfile();
  }, [username]);

  return (
    <div>
      <h1>Public Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {publicUser ? (
        <div>
          <h2>{publicUser.username}</h2>
          <p>Email: {publicUser.email}</p>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
}

export default PublicProfile;
