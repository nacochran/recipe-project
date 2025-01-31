import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div>
      <h1>Welcome to the Recipe Project!</h1>
      <p><Link to="/login">Login</Link> or <Link to="/signup">Sign up</Link></p>
    </div>
  );
}

export default WelcomePage;
