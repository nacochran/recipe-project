import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, ChefHat, Calendar, Heart, Award, Clock, LogOut,
  Settings, PlusCircle, BarChart3
} from 'lucide-react';
import { userStats } from '../data/user-data';  // Assuming userStats is still static
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Img } from '@/components/ui/Img';


function PrivateProfile({ user }) {
  // Initialize state for profile data
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recipes, setRecipes] = useState('');
  const stats = userStats;

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/recipes?user=${user.username}&sort=rating&limit=2`);
      const json = await response.json();

      if (json.error) {
        setError(json.error);
      } else {
        setRecipes(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/private-user-data/${user.username}`, {
          method: 'GET',
          credentials: 'include'  // Ensure we include the necessary credentials (like session or cookie)
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Testing data: ", data);
          setProfile(data.user);
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user.username]); // Triggered when the username changes

  useEffect(() => {
    fetchRecipes();
  }, []);

  const profileLinks = [
    { label: "My Recipes", icon: ChefHat, path: "/profile/recipes" },
    { label: "Meal Planner", icon: Calendar, path: "/profile/meal-planner" },
    { label: "Settings", icon: Settings, path: "/profile/settings" }
  ];

  if (loading) {
    // If the profile is still loading, show a loading skeleton
    return (
      <div className="recipe-container py-8">
        {/* Skeleton Loader */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-6 border-4 border-recipe-500">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-36 mb-2" />
              <Skeleton className="h-4 w-56 mb-4" />
              <div className="mt-4 flex justify-center sm:justify-start gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
        {/* Repeat for other skeletons */}
      </div>
    );
  }

  return (
    <div className="recipe-container py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          {/* Avatar */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-6 border-4 border-recipe-500">
            {profile.avatar_url ? (
              <Img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-recipe-100 flex items-center justify-center">
                <User className="w-12 h-12 text-recipe-500" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{profile.display_name}</h1>
            <p className="text-gray-600">@{profile.username}</p>
            <p className="mt-2 text-gray-700">{profile.bio}</p>

            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4">
              <div className="text-center">
                <span className="block font-bold text-recipe-600">{profile.recipe_count}</span>
                <span className="text-sm text-gray-500">Recipes</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-recipe-600">{profile.followers_count}</span>
                <span className="text-sm text-gray-500">Followers</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-recipe-600">{profile.following_count}</span>
                <span className="text-sm text-gray-500">Following</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 sm:mt-0">
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Links */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">My Kitchen</h2>
            <div className="space-y-3">
              {profileLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center p-3 rounded-md hover:bg-recipe-50 transition-colors"
                >
                  <link.icon className="w-5 h-5 mr-3 text-recipe-500" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Achievements</h2>
            <div className="space-y-3">
              {stats.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-md ${achievement.achieved
                    ? 'bg-recipe-50'
                    : 'bg-gray-50 opacity-70'
                    }`}
                >
                  <Award className={`w-5 h-5 mr-3 ${achievement.achieved
                    ? 'text-recipe-500'
                    : 'text-gray-400'
                    }`} />
                  <div>
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-xs text-gray-500">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Summary and Stats */}
        <div className="lg:col-span-2">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Your Stats</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-recipe-50 p-4 rounded-lg text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-recipe-500" />
                <div className="text-xl font-bold text-recipe-700">{"0"}</div>
                <div className="text-xs text-gray-600">Planned Meals</div>
              </div>

              <div className="bg-spice-50 p-4 rounded-lg text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-spice-500" />
                <div className="text-xl font-bold text-spice-700">{new Date().toISOString().split("T")[0].split("-")[0]}</div>
                <div className="text-xs text-gray-600">Member Since</div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <ChefHat className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="text-xl font-bold text-blue-700">{profile.recipe_count}</div>
                <div className="text-xs text-gray-600">Your Recipes</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <Heart className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <div className="text-xl font-bold text-purple-700">{profile.total_likes}</div>
                <div className="text-xs text-gray-600">Likes</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
              <Button variant="ghost" size="sm" className="text-sm text-recipe-600">
                <BarChart3 className="w-4 h-4 mr-1" />
                View Stats
              </Button>
            </div>

            <div className="divide-y">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="py-3 flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {activity.type === 'recipe' ? (
                      <ChefHat className="w-5 h-5 text-recipe-500" />
                    ) : (
                      <User className="w-5 h-5 text-spice-500" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm">
                      You {activity.action} {activity.type === 'recipe' ? 'a recipe' : 'user'}{' '}
                      <span className="font-medium">{activity.name}</span>
                    </p>
                    <span className="text-xs text-gray-500">{activity.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Popular Recipes Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Your Popular Recipes</h2>
              <Link to="/profile/recipes" className="text-sm text-recipe-600 hover:underline">View All</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recipes && recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`../${user.username}/recipes/${recipe.slug}`}
                    className="border rounded-md p-3 flex hover:bg-recipe-50 transition"
                  >
                    <div className="h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <Img
                        src={recipe.image_url}
                        alt={recipe.name}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <h3 className="text-md font-bold text-gray-800">{recipe.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                      <p className="text-xs text-gray-500 mt-1">❤️ {recipe.likes} likes</p>
                    </div>
                  </Link>
                ))
              ) : (
                [1, 2].map((item) => (
                  <div key={item} className="border rounded-md p-3 flex">
                    <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                    <div className="ml-3 flex-grow">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-2" />
                      <Skeleton className="h-3 w-2/3" />
                      <div className="flex mt-2 items-center">
                        <Skeleton className="h-3 w-8 rounded-full" />
                        <Skeleton className="h-3 w-8 rounded-full ml-2" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4">
              <Link
                to="/profile/recipes/create"
                className="w-full bg-spice-400 text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-spice-500 transition-colors"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Create New Recipe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivateProfile;
