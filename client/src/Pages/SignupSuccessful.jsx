import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignupSuccessful() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Signup Successful</h1>
      <p>Welcome! You have successfully signed up.</p>
      <button onClick={() => navigate('/login')}>Login!</button>
    </div>
  );
}

export default SignupSuccessful;
