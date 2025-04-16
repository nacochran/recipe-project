export const userData = {
  username: "chefmichael",
  displayName: "Chef Michael",
  email: "michael@recipepal.com",
  bio: "Passionate home cook exploring flavors from around the world.",
  profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop",
  joinedDate: "January 2023",
  following: 124,
  followers: 348,
  preferences: {
    newsletter: true,
    publicProfile: true,
    darkMode: false
  }
};

export const userRecipes = [
  {
    id: "ur1",
    title: "Homemade Sourdough Bread",
    description: "Perfect crusty sourdough with a chewy interior.",
    image: "https://images.unsplash.com/photo-1586444248879-bc604bc77f85?w=500&auto=format&fit=crop&q=60",
    prepTime: "30 min",
    cookTime: "45 min",
    tags: ["bread", "baking", "sourdough"],
    saved: false,
    spinOff: false
  },
  {
    id: "ur2",
    title: "Garlic Butter Shrimp Pasta",
    description: "Quick and flavorful weeknight dinner.",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&auto=format&fit=crop&q=60",
    prepTime: "15 min",
    cookTime: "20 min",
    tags: ["pasta", "seafood", "quick"],
    saved: false,
    spinOff: false
  },
  {
    id: "ur3",
    title: "Japanese Pancakes",
    description: "Fluffy, souffle-like pancakes with maple syrup.",
    image: "https://images.unsplash.com/photo-1589438104088-8469c4a218c8?w=500&auto=format&fit=crop&q=60",
    prepTime: "20 min",
    cookTime: "15 min",
    tags: ["breakfast", "japanese", "sweet"],
    saved: false,
    spinOff: true
  }
];

export const savedRecipes = [
  {
    id: "sr1",
    title: "Classic Tiramisu",
    description: "Authentic Italian dessert with coffee-soaked ladyfingers.",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60",
    prepTime: "30 min",
    cookTime: "4 hours",
    tags: ["dessert", "italian", "coffee"],
    saved: true,
    creator: "italianChef42"
  },
  {
    id: "sr2",
    title: "Spicy Kimchi Stew",
    description: "Warm, comforting Korean stew with tofu and pork belly.",
    image: "https://images.unsplash.com/photo-1627662168223-7df99068099a?w=500&auto=format&fit=crop&q=60",
    prepTime: "15 min",
    cookTime: "25 min",
    tags: ["korean", "spicy", "soup"],
    saved: true,
    creator: "seoulFood"
  },
  {
    id: "sr3",
    title: "Perfect French Omelette",
    description: "Soft, buttery French-style omelette with herbs.",
    image: "https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=500&auto=format&fit=crop&q=60",
    prepTime: "5 min",
    cookTime: "3 min",
    tags: ["breakfast", "french", "quick"],
    saved: true,
    creator: "parisianChef"
  }
];