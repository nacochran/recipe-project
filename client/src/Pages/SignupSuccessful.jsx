import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SignupSuccessful() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-recipe-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-500 hover:shadow-xl">
        <div className="text-center mb-8">
          <div className="bg-recipe-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-recipe-600" />
          </div>

          <h1 className="text-3xl font-bold text-recipe-700 mb-2">Welcome to RecipePal!</h1>
          <p className="text-lg text-gray-600">
            Your account has been successfully created and is ready to use.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-recipe-50 p-4 rounded-lg border border-recipe-100">
            <h3 className="font-medium text-recipe-800 mb-2">What's next?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="bg-recipe-200 rounded-full p-1 mr-3 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-recipe-700" />
                </div>
                Create your first recipe
              </li>
              <li className="flex items-start">
                <div className="bg-recipe-200 rounded-full p-1 mr-3 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-recipe-700" />
                </div>
                Explore recipes from other chefs
              </li>
              <li className="flex items-start">
                <div className="bg-recipe-200 rounded-full p-1 mr-3 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-recipe-700" />
                </div>
                Plan your meals for the week
              </li>
            </ul>
          </div>

          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-recipe-600 hover:bg-recipe-700 text-white font-medium py-3"
          >
            Continue to Login
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-recipe-600 hover:text-recipe-800 text-sm font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupSuccessful;
