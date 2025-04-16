export const userData = {
  currentUser: {
    id: 1,
    username: "chefmichelle",
    email: "michelle@example.com",
    name: "Michelle Chen",
    bio: "Passionate home cook exploring global flavors and healthy eating",
    joinedDate: "January 2023",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    favorites: 24,
    followers: 156,
    following: 89,
    recipeCount: 18,
  },
  publicUsers: [
    {
      id: 2,
      username: "chefjames",
      email: "james@example.com",
      name: "James Wilson",
      bio: "Professional chef specialized in Italian cuisine",
      joinedDate: "March 2022",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
      followers: 1243,
      following: 350,
      recipeCount: 45,
    },
    {
      id: 3,
      username: "bakinglove",
      email: "sarah@example.com",
      name: "Sarah Johnson",
      bio: "Baking enthusiast | Pastry chef | Food photographer",
      joinedDate: "October 2022",
      avatar: "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
      followers: 982,
      following: 124,
      recipeCount: 37,
    }
  ]
};

export const userStats = {
  recentActivity: [
    { type: "recipe", action: "created", name: "Garlic Butter Shrimp Pasta", date: "2 days ago" },
    { type: "recipe", action: "liked", name: "Vegan Chocolate Cake", date: "3 days ago" },
    { type: "user", action: "followed", name: "bakinglove", date: "1 week ago" },
    { type: "recipe", action: "saved", name: "Thai Green Curry", date: "1 week ago" },
  ],
  mealPlanStats: {
    plannedMeals: 14,
    completedMeals: 8,
    streak: 5,
    favoriteCategory: "Italian",
  },
  achievements: [
    { name: "Recipe Master", description: "Created 10+ recipes", icon: "trophy", achieved: true },
    { name: "Popular Chef", description: "Received 50+ likes", icon: "thumbsUp", achieved: true },
    { name: "Health Enthusiast", description: "Created 5+ healthy recipes", icon: "heart", achieved: false }
  ]
};