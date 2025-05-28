import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, ChefHat, Clock, Heart, Users } from 'lucide-react';
import RecipeGrid from '../components/RecipeGrid';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Img } from '@/components/ui/Img';

function PublicProfile({ user }) {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [publicUser, setPublicUser] = useState(null);
  const [error, setError] = useState('');
  const [userRecipes, setUserRecipes] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch public user profile
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/public-user-data/${username}`, {
          method: 'GET',
          credentials: 'include'
        });

        const data = await response.json();

        console.log(data);

        if (response.ok && data.error == null) {
          setPublicUser(data.user);
        } else {
          setError('User not found.');
        }
      } catch (error) {
        setError('Error fetching user data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  // Fetch user's recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recipes?user=${username}&sort=rating&limit=2`);
        const json = await response.json();

        if (json.error) {
          setError(json.error);
        } else {
          setUserRecipes(json.data || []);
        }
      } catch (err) {
        setError('Failed to fetch recipes.');
      }
    };

    if (username) {
      fetchRecipes();
    }
  }, [username]);

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!user || !user?.username || !publicUser?.username) return;

      try {
        const res = await fetch(`http://localhost:5000/is-following-user?followee_username=${publicUser.username}&follower_username=${user.username}`);
        const data = await res.json();

        if (data.is_following !== undefined) {
          setIsFollowing(data.is_following);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkIfFollowing();
  }, [user?.username, publicUser?.username]);

  const handleFollowToggle = async () => {
    if (user == null) {
      alert("You cannot follow users unless you are logged in.");
      return;
    } else if (user.username == publicUser.username) {
      alert("Cannot follow yourself!");
      return;
    }
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);

    try {
      const response = await fetch('http://localhost:5000/toggle-follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          follower_username: user.username,
          followee_username: publicUser.username,
          following_state: newFollowingState
        })
      });

      const data = await response.json();

      setPublicUser(prev => ({
        ...prev,
        followers_count: data.followers_count
      }));


      if (data.error) {
        console.error("Server error:", data.error);
        // Revert the state on error
        setIsFollowing(!newFollowingState);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
      // Revert the state on error
      setIsFollowing(!newFollowingState);
    }
  };

  if (isLoading) return <SkeletonUI />;

  if (error) {
    return (
      <div className="recipe-container py-8 text-center">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">User Not Found</h2>
        <p className="text-gray-600">{error}</p>
        <Button variant="default" onClick={() => window.history.back()} className="mt-6">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="recipe-container py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-6 border-4 border-recipe-500">
            {publicUser.avatar_url ? (
              <Img src={publicUser.avatar_url} alt={publicUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-recipe-100 flex items-center justify-center">
                <User className="w-12 h-12 text-recipe-500" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{publicUser.display_name}</h1>
            <p className="text-gray-600">@{publicUser.username}</p>
            <p className="mt-2 text-gray-700">{publicUser.bio}</p>

            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4">
              <Stat label="Recipes" value={publicUser.recipe_count} />
              <Stat label="Followers" value={publicUser.followers_count} />
              <Stat label="Following" value={publicUser.following_count} />
            </div>
          </div>

          <div className="mt-4 sm:mt-0">
            <Button
              onClick={handleFollowToggle}
              variant={isFollowing ? 'outline' : 'default'}
              className={isFollowing ? 'border-recipe-500 text-recipe-600' : ''}
            >
              <Users className="w-4 h-4 mr-2" />
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBlock icon={<ChefHat />} label="Recipes" value={publicUser.recipe_count} color="text-recipe-600" bg="bg-recipe-50" />
        <StatBlock icon={<Clock />} label="Member Since" value={new Date().toISOString().split("T")[0].split("-")[0]} color="text-spice-500" bg="bg-spice-50" />
        <StatBlock icon={<Users />} label="Followers" value={publicUser.followers_count} color="text-blue-500" bg="bg-blue-50" />
        <StatBlock icon={<Heart />} label="Likes Received" value={publicUser.total_likes} color="text-purple-500" bg="bg-purple-50" />
      </div>

      {/* Recipes Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {publicUser.display_name}'s Recipes
          </h2>
          {/* <Link
            to={`/user/${username}/recipes`}
            className="text-sm text-recipe-600 hover:underline"
          >
            View all
          </Link> */}
        </div>

        {userRecipes.length > 0 ? (
          <RecipeGrid recipes={userRecipes} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800">No recipes yet</h3>
            <p className="text-gray-600 mt-2">
              {publicUser.display_name} hasn't uploaded any recipes yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <span className="block font-bold text-recipe-600">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

function StatBlock({ icon, label, value, color, bg }) {
  return (
    <div className={`text-center p-3 ${bg} rounded-lg`}>
      <div className={`w-6 h-6 mx-auto mb-2 ${color}`}>{icon}</div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function SkeletonUI() {
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
    </div>
  );
}

export default PublicProfile;
