import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignupSuccessful() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <div className="text-center mb-6">
          <img
            src="https://img.icons8.com/ios/452/checkmark.png" // A checkmark image
            alt="Success"
            className="mx-auto h-20 w-20 mb-4 animate-bounce"
          />
          <h1 className="text-4xl font-bold text-blue-600">Signup Successful</h1>
          <p className="text-lg text-gray-600 mt-2">Welcome! You have successfully signed up.</p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupSuccessful;
