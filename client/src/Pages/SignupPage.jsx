import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        endpoint = "http://localhost:5000/register";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {step === 1
            ? "Sign Up"
            : step === 2
              ? "Verify Email"
              : "Resend Verification"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email/Username/Password Fields */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-gray-600 text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring focus:ring-blue-300"
                />
              </div>
            </>
          )}

          {/* Verification Code */}
          {step === 2 && (
            <div>
              <label className="block text-gray-600 text-sm font-medium">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring focus:ring-blue-300"
              />
            </div>
          )}

          {/* Resend Form */}
          {step === 3 && (
            <div>
              <label className="block text-gray-600 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring focus:ring-blue-300"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 rounded ${step === 1
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : step === 2
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
          >
            {step === 1
              ? "Sign Up"
              : step === 2
                ? "Verify"
                : "Resend Verification"}
          </button>
        </form>

        {/* Resend Button shown when an invalid code is entered */}
        {showResendButton && (
          <div className="mt-4 text-center">
            <button
              onClick={handleResendButtonClick}
              className="text-blue-600 hover:underline"
            >
              Resend Email
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        {message && <p className="text-green-500 text-sm mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default SignupPage;
