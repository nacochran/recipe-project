
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, Lock, Mail } from "lucide-react";

function LoginPage({ user, updateUserStatus }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [showResendForm, setShowResendForm] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      console.log(data);

      if (response.ok && data.user) {
        updateUserStatus();
        navigate('/profile');
      } else {
        setError(data.error);
        if (data.err_code === 'not_verified') {
          setShowResendForm(true);
        }
      }
    } catch (error) {
      console.error('Login request failed:', error);
      setError('Failed to connect to the server.');
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationCode }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        if (data.err_code === 'invalid_code') {
          setShowResendForm(true);
          setVerificationCode('');
        }
      } else {
        setMessage(data.message);
        setShowVerificationForm(false);
        setShowResendForm(false);
      }
    } catch (error) {
      console.error('Verification request failed:', error);
      setError('Failed to connect to the server.');
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMessage(data.message);
        setShowVerificationForm(true);
        setShowResendForm(false);
      }
    } catch (error) {
      console.error('Resend verification request failed:', error);
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-6">
      <div className="bg-card border border-border p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-recipe-500 mb-2">Login to RecipePal</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
          {error && <p className="text-destructive mt-4 p-3 bg-destructive/10 rounded-md border border-destructive/20">{error}</p>}
          {message && <p className="text-primary mt-4 p-3 bg-primary/10 rounded-md border border-primary/20">{message}</p>}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 py-2 px-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 py-2 px-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full recipe-button-primary"
          >
            Login
          </Button>
        </form>

        {/* Link to Register */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-recipe-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Resend Verification Form (only shows if needed) */}
        {showResendForm && (
          <form onSubmit={handleResendVerification} className="space-y-4 mt-6 pt-6 border-t border-border">
            <h3 className="text-lg font-medium text-center mb-2">Resend Verification</h3>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 py-2 px-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
            >
              Resend Verification Email
            </Button>
          </form>
        )}

        {/* Verification Form (only shows if needed) */}
        {showVerificationForm && (
          <form onSubmit={handleVerification} className="space-y-4 mt-6 pt-6 border-t border-border">
            <h3 className="text-lg font-medium text-center mb-2">Enter Verification Code</h3>
            <div>
              <input
                type="text"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                maxLength="6"
                className="w-full py-2 px-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center font-mono text-lg tracking-wider"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
            >
              Verify
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;