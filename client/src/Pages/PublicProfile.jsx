import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, ChefHat, Clock, Heart, Users } from 'lucide-react';
import { userData } from '../data/user-data';
import { recipes } from '../data/recipes';
import RecipeGrid from '../components/RecipeGrid';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function PublicProfile({ user }) {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [publicUser, setUser] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Simulating API call with our test data
      try {
        setIsLoading(true);
        setTimeout(() => {
          const foundUser = userData.publicUsers.find(u => u.username === username);

          if (foundUser) {
            setUser(foundUser);
            // Use a subset of recipes as this user's recipes
            const userRecipesData = recipes.slice(0, 6);
            setUserRecipes(userRecipesData);
          } else {
            setError('User not found');
          }

          setIsLoading(false);
        }, 800); // Simulate loading delay
      } catch (err) {
        setError('Error fetching user profile');
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return (
      <div className="recipe-container py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <Skeleton className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-6" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <div className="mt-4 flex gap-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <Skeleton className="h-12 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-60 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-container py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600">{error}</p>
          <Button
            variant="default"
            onClick={() => window.history.back()}
            className="mt-6"
          >
            Go Back
          </Button>
        </div>
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
            {publicUser.avatar ? (
              <img
                src={publicUser.avatar}
                alt={publicUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-recipe-100 flex items-center justify-center">
                <User className="w-12 h-12 text-recipe-500" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{publicUser.name}</h1>
            <p className="text-gray-600">@{publicUser.username}</p>
            <p className="mt-2 text-gray-700">{publicUser.bio}</p>

            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4">
              <div className="text-center">
                <span className="block font-bold text-recipe-600">{publicUser.recipeCount}</span>
                <span className="text-sm text-gray-500">Recipes</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-recipe-600">{publicUser.followers}</span>
                <span className="text-sm text-gray-500">Followers</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-recipe-600">{publicUser.following}</span>
                <span className="text-sm text-gray-500">Following</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={handleFollowToggle}
              variant={isFollowing ? "outline" : "default"}
              className={isFollowing ? "border-recipe-500 text-recipe-600" : ""}
            >
              <Users className="w-4 h-4 mr-2" />
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-recipe-50 rounded-lg">
            <ChefHat className="w-6 h-6 mx-auto mb-2 text-recipe-600" />
            <div className="text-xl font-bold text-gray-800">{publicUser.recipeCount}</div>
            <div className="text-sm text-gray-600">Recipes</div>
          </div>

          <div className="text-center p-3 bg-spice-50 rounded-lg">
            <Clock className="w-6 h-6 mx-auto mb-2 text-spice-500" />
            <div className="text-xl font-bold text-gray-800">2 years</div>
            <div className="text-sm text-gray-600">Member Since</div>
          </div>

          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-xl font-bold text-gray-800">{publicUser.followers}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Heart className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <div className="text-xl font-bold text-gray-800">856</div>
            <div className="text-sm text-gray-600">Likes Received</div>
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {publicUser.name}'s Recipes
        </h2>

        {userRecipes.length > 0 ? (
          <RecipeGrid recipes={userRecipes} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800">No recipes yet</h3>
            <p className="text-gray-600 mt-2">
              {publicUser.name} hasn't uploaded any recipes yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicProfile;
