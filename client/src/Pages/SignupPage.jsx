import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Lock, Mail, KeyRound } from "lucide-react";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1 = Signup, 2 = Verification, 3 = Resend
  const [showResendButton, setShowResendButton] = useState(false); // Flag to show the resend button

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      let endpoint = "";
      let body = {};

      // Set the request data based on the current step
      if (step === 1) {
        endpoint = "http://localhost:5000/signup";
        body = { username, email, password };
      } else if (step === 2) {
        endpoint = "http://localhost:5000/verify";
        body = { verificationCode };
      } else if (step === 3) {
        endpoint = "http://localhost:5000/resend-verification";
        body = { email };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        setMessage(data.message);
        if (step === 1) {
          setStep(2); // Move to verification
        } else if (step === 2) {
          navigate("/signup-successful");
        } else {
          setStep(2); // After resend, go back to verification
        }
      } else {
        setError(data.error);
        if (step === 2 && data.err_code === "invalid_code") {
          setShowResendButton(true); // Show the resend button on invalid code
        }
      }
    } catch (error) {
      setError("Error. Please try again.");
    }
  };

  const handleResendButtonClick = () => {
    setStep(3); // Switch to Resend form when the button is clicked
    setShowResendButton(false); // Hide the resend button after click
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <div className="bg-card border border-border p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-recipe-500 mb-2">
          {step === 1
            ? "Create Account"
            : step === 2
              ? "Verify Your Email"
              : "Resend Verification"}
        </h2>
        <p className="text-muted-foreground text-center mb-6">
          {step === 1
            ? "Join RecipePal to start cooking!"
            : step === 2
              ? "Check your email for the verification code"
              : "Enter your email to receive a new code"}
        </p>

        {error && <p className="text-destructive mb-4 p-3 bg-destructive/10 rounded-md border border-destructive/20">{error}</p>}
        {message && <p className="text-primary mb-4 p-3 bg-primary/10 rounded-md border border-primary/20">{message}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email/Username/Password Fields */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 py-2 px-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-10 py-2 px-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 py-2 px-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </>
          )}

          {/* Verification Code */}
          {step === 2 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Verification Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="w-full pl-10 py-2 px-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-mono tracking-wider"
                />
              </div>
            </div>
          )}

          {/* Resend Form */}
          {step === 3 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 py-2 px-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full ${step === 1
              ? "recipe-button-primary"
              : step === 2
                ? "bg-recipe-500 text-white hover:bg-recipe-600"
                : "bg-spice-400 text-white hover:bg-spice-500"
              }`}
          >
            {step === 1
              ? "Sign Up"
              : step === 2
                ? "Verify"
                : "Resend Verification"}
          </Button>
        </form>

        {/* Link to Login */}
        {step === 1 && (
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-recipe-500 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        )}

        {/* Resend Button shown when an invalid code is entered */}
        {showResendButton && (
          <div className="mt-4 text-center">
            <button
              onClick={handleResendButtonClick}
              className="text-spice-500 hover:text-spice-600 hover:underline"
            >
              Resend Verification Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignupPage;