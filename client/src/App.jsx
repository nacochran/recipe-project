import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import LoadingComponent from "./components/ui/LoadingComponent";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Search from "./pages/Search";
import RecipeDetail from "./pages/RecipeDetail";
import ProfileRecipes from "./pages/ProfileRecipes";
import MealPlanner from "./pages/MealPlanner";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import SignupSuccessful from './Pages/SignupSuccessful';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PrivateProfile from './pages/PrivateProfile';
import PublicProfile from './pages/PublicProfile';
import Settings from './pages/Settings';
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";

const queryClient = new QueryClient();

const RequireAuth = ({ user }) => {
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  // User authentication state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState('');
  // const navigate = useNavigate();

  // Check user status
  const checkUserStatus = async () => {
    setError('');
    setUser('loading-user');
    setLoading(true); // Set loading while fetching

    try {
      const response = await fetch('http://localhost:5000/session-data', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.user || null);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Failed to authenticate user from session.', error);
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false); // Finish loading after fetch attempt
    }
  };

  // Run checkUserStatus on load
  useEffect(() => {
    checkUserStatus();
  }, []);

  // Show loading message while checking authentication
  // if (loading) {
  //   return (
  //     <div>
  //       <Header />
  //       <div className="text-center mt-20">Loading...</div> {/* Display loading message */}
  //       <Footer />
  //     </div>
  //   );
  // }

  // After loading is finished, return the routes
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          {loading ? (
            <LoadingComponent />
          ) : (
            <Routes>
              <Route path="/" element={<Layout user={user} />}>
                <Route index element={<Home />} />
                <Route path="search" element={<Search />} />
                <Route path=":username/recipes/:recipe_slug" element={<RecipeDetail user={user} />} />
                <Route path="terms-of-service" element={<TermsOfService />} />

                {/* Authentication Pages */}
                <Route path="/login" element={<LoginPage user={user} updateUserStatus={checkUserStatus} />} />
                <Route path="/signup" element={<SignupPage user={user} />} />
                <Route path="/signup-successful" element={<SignupSuccessful />} />

                {/* Private Profile Pages */}
                <Route element={<RequireAuth user={user} />}>
                  <Route path="/profile" element={<PrivateProfile user={user} />} />
                  <Route path="/profile/recipes" element={<ProfileRecipes user={user} />} />
                  <Route path="/profile/meal-planner" element={<MealPlanner user={user} />} />
                  <Route path="/profile/settings" element={<Settings user={user} setUser={setUser} />} />
                  <Route path="/profile/recipes/create" element={<CreateRecipe user={user} />} />
                  <Route path="/profile/recipes/:recipe_slug/edit" element={<EditRecipe user={user} />} />
                </Route>

                {/* Public Profiles */}
                <Route path="/user/:username" element={<PublicProfile user={user} />} />

                <Route path="*" element={<NotFound />} />


              </Route>
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

}

export default App;
