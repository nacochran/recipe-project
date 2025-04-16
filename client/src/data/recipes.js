


// Mock recipes data
export const recipes = [
  {
    id: 1,
    title: "Creamy Garlic Parmesan Pasta",
    description: "A quick and easy pasta dish with a creamy garlic parmesan sauce that's perfect for weeknight dinners.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=500",
    ingredients: [
      "8 oz fettuccine pasta",
      "3 tbsp butter",
      "4 cloves garlic, minced",
      "1 cup heavy cream",
      "1 cup grated parmesan cheese",
      "Salt and pepper to taste",
      "Fresh parsley, chopped for garnish"
    ],
    instructions: [
      "Cook pasta according to package instructions. Reserve 1/2 cup pasta water before draining.",
      "In a large skillet, melt butter over medium heat. Add garlic and sauté for 1-2 minutes until fragrant.",
      "Pour in heavy cream and bring to a simmer. Cook for 3-4 minutes until slightly thickened.",
      "Reduce heat to low and whisk in parmesan cheese until melted and smooth.",
      "Add drained pasta to the sauce and toss to coat. If sauce is too thick, add some reserved pasta water.",
      "Season with salt and pepper. Garnish with fresh parsley before serving."
    ],
    time: 25, // in minutes
    servings: 4,
    difficulty: "easy",
    cuisine: "Italian",
    mealType: "dinner",
    dietaryInfo: ["vegetarian"],
    rating: 4.7,
    reviews: [
      { user: "pasta_lover", comment: "Super creamy and delicious!", rating: 5 },
      { user: "chef_john", comment: "I added some red pepper flakes for a kick. Perfect!", rating: 5 },
      { user: "cooking_mom", comment: "My family loved it, but a bit too rich for my taste.", rating: 4 }
    ],
    author: "RecipePal Team",
    createdAt: "2023-10-15",
    labels: ["pasta", "comfort food", "quick meals", "vegetarian"]
  },
  {
    id: 2,
    title: "Avocado Toast with Poached Eggs",
    description: "Creamy avocado spread on toasted bread topped with perfectly poached eggs. A nutritious breakfast that will keep you energized all morning.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=500",
    ingredients: [
      "2 slices of whole grain bread",
      "1 ripe avocado",
      "2 eggs",
      "1 tbsp white vinegar",
      "1/2 lemon, juiced",
      "Red pepper flakes to taste",
      "Salt and pepper to taste",
      "Fresh herbs (optional)"
    ],
    instructions: [
      "Toast the bread slices until golden brown.",
      "Mash the avocado in a bowl with lemon juice, salt, and pepper.",
      "Spread the avocado mixture evenly on the toast.",
      "Bring a pot of water to a gentle simmer and add white vinegar.",
      "Create a whirlpool in the water and crack each egg into the center. Cook for 3-4 minutes.",
      "Remove poached eggs with a slotted spoon and place on paper towel to drain.",
      "Place one poached egg on each avocado toast.",
      "Season with salt, pepper, red pepper flakes, and fresh herbs if desired."
    ],
    time: 15, // in minutes
    servings: 1,
    difficulty: "medium",
    cuisine: "American",
    mealType: "breakfast",
    dietaryInfo: ["vegetarian"],
    rating: 4.8,
    reviews: [
      { user: "health_nut", comment: "Perfect balanced breakfast!", rating: 5 },
      { user: "avocado_addict", comment: "I make this every morning. Never gets old.", rating: 5 },
      { user: "breakfast_king", comment: "Good, but poaching eggs takes practice.", rating: 4 }
    ],
    author: "RecipePal Team",
    createdAt: "2023-09-28",
    labels: ["breakfast", "healthy", "eggs", "vegetarian", "quick"]
  },
  {
    id: 3,
    title: "Spicy Thai Basil Chicken (Pad Krapow Gai)",
    description: "An authentic Thai street food dish that's spicy, savory, and fragrant with Thai basil. Ready in just 15 minutes!",
    image: "https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?q=80&w=500",
    ingredients: [
      "1 lb ground chicken",
      "4 cloves garlic, minced",
      "3-4 Thai chilies, finely chopped",
      "1/3 cup chicken broth",
      "1 tbsp oyster sauce",
      "1 tbsp soy sauce",
      "2 tsp fish sauce",
      "1 tsp sugar",
      "1 cup Thai holy basil leaves",
      "2 tbsp vegetable oil",
      "Fried egg (optional)",
      "Steamed rice for serving"
    ],
    instructions: [
      "Heat oil in a wok or large skillet over high heat.",
      "Add garlic and chilies, stir-fry for 30 seconds until fragrant.",
      "Add ground chicken and cook until browned, breaking up the meat, about 5 minutes.",
      "Mix chicken broth, oyster sauce, soy sauce, fish sauce, and sugar in a small bowl.",
      "Pour sauce mixture over the chicken and stir-fry for 2 minutes.",
      "Add basil leaves and stir until wilted, about 30 seconds.",
      "Serve immediately over steamed rice with a fried egg on top if desired."
    ],
    time: 15, // in minutes
    servings: 2,
    difficulty: "easy",
    cuisine: "Thai",
    mealType: "dinner",
    dietaryInfo: [],
    rating: 4.9,
    reviews: [
      { user: "thai_food_fan", comment: "Just like I had in Bangkok!", rating: 5 },
      { user: "spice_lover", comment: "Perfectly spicy and so quick to make.", rating: 5 },
      { user: "homecook123", comment: "Added bell peppers and it was amazing.", rating: 5 }
    ],
    author: "RecipePal Team",
    createdAt: "2023-11-05",
    labels: ["Thai", "spicy", "quick dinner", "chicken"]
  },
  {
    id: 4,
    title: "Chocolate Chip Cookies",
    description: "Classic, chewy chocolate chip cookies with crisp edges and soft centers. The perfect sweet treat!",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=500",
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup (2 sticks) unsalted butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed brown sugar",
      "1 tsp vanilla extract",
      "2 large eggs",
      "2 cups semi-sweet chocolate chips",
      "1 cup chopped walnuts (optional)"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "Combine flour, baking soda, and salt in a small bowl.",
      "Beat butter, granulated sugar, brown sugar, and vanilla in a large bowl until creamy.",
      "Add eggs one at a time, beating well after each addition.",
      "Gradually beat in flour mixture.",
      "Stir in chocolate chips and nuts if using.",
      "Drop by rounded tablespoon onto ungreased baking sheets.",
      "Bake for 9 to 11 minutes or until golden brown.",
      "Cool on baking sheets for 2 minutes; remove to wire racks to cool completely."
    ],
    time: 30, // in minutes
    servings: 24,
    difficulty: "easy",
    cuisine: "American",
    mealType: "dessert",
    dietaryInfo: ["vegetarian"],
    rating: 4.9,
    reviews: [
      { user: "cookie_monster", comment: "Best cookies ever! So chewy and perfect.", rating: 5 },
      { user: "baking_queen", comment: "My family requests these every weekend.", rating: 5 },
      { user: "dessert_first", comment: "Classic recipe that never disappoints.", rating: 5 }
    ],
    author: "RecipePal Team",
    createdAt: "2023-08-20",
    labels: ["dessert", "baking", "cookies", "vegetarian", "kid-friendly"]
  },
  {
    id: 5,
    title: "Vegan Buddha Bowl",
    description: "A nourishing bowl packed with colorful vegetables, plant-based protein, and a delicious tahini dressing.",
    image: "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?q=80&w=500",
    ingredients: [
      "1 cup cooked quinoa",
      "1 cup chickpeas, rinsed and drained",
      "1 sweet potato, cubed and roasted",
      "1 cup broccoli florets, steamed",
      "1 avocado, sliced",
      "1 cup spinach leaves",
      "1/4 cup red cabbage, shredded",
      "2 tbsp tahini",
      "1 tbsp lemon juice",
      "1 tbsp maple syrup",
      "2 tbsp water",
      "Salt and pepper to taste",
      "Sesame seeds for garnish"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C) and roast sweet potato cubes for 20-25 minutes until tender.",
      "Steam broccoli florets until bright green and tender-crisp, about 5 minutes.",
      "Make the dressing by whisking together tahini, lemon juice, maple syrup, water, salt, and pepper.",
      "Assemble the bowl by arranging quinoa, chickpeas, sweet potato, broccoli, avocado, spinach, and cabbage in sections.",
      "Drizzle with tahini dressing and sprinkle with sesame seeds before serving."
    ],
    time: 40, // in minutes
    servings: 2,
    difficulty: "easy",
    cuisine: "Fusion",
    mealType: "lunch",
    dietaryInfo: ["vegan", "gluten-free"],
    rating: 4.8,
    reviews: [
      { user: "plant_based_life", comment: "So satisfying and nutritious!", rating: 5 },
      { user: "vegan_chef", comment: "That tahini dressing is everything!", rating: 5 },
      { user: "health_is_wealth", comment: "Great recipe, but takes me longer than 40 mins to prepare.", rating: 4 }
    ],
    author: "RecipePal Team",
    createdAt: "2023-10-02",
    labels: ["vegan", "healthy", "bowl", "gluten-free", "meal prep"]
  },
  {
    id: 6,
    title: "Classic Beef Lasagna",
    description: "Layers of pasta, rich meat sauce, and creamy cheese blend together in this classic Italian comfort food.",
    image: "https://images.unsplash.com/photo-1619895092538-128f6e0a7b21?q=80&w=500",
    ingredients: [
      "12 lasagna noodles",
      "1 lb ground beef",
      "1 onion, chopped",
      "3 garlic cloves, minced",
      "2 cans (15 oz each) tomato sauce",
      "1 can (6 oz) tomato paste",
      "2 tsp dried basil",
      "1 tsp Italian seasoning",
      "1/2 tsp salt",
      "1/4 tsp black pepper",
      "15 oz ricotta cheese",
      "1 egg, beaten",
      "3 cups mozzarella cheese, shredded",
      "1/2 cup Parmesan cheese, grated",
      "2 tbsp fresh parsley, chopped"
    ],
    instructions: [
      "Cook lasagna noodles according to package directions; drain.",
      "In a large skillet, cook beef and onion over medium heat until meat is no longer pink. Add garlic; cook 1 minute longer. Drain fat.",
      "Stir in tomato sauce, tomato paste, basil, Italian seasoning, salt, and pepper. Bring to a boil. Reduce heat; simmer, uncovered, for 15-20 minutes.",
      "In a small bowl, combine ricotta cheese and egg.",
      "Preheat oven to 375°F. Spread 1/2 cup meat sauce into a greased 13x9-in. baking dish. Layer with 3 noodles, a third of the ricotta mixture, a third of the remaining meat sauce, and a third of the mozzarella. Repeat layers twice.",
      "Sprinkle with Parmesan cheese. Cover and bake for 25 minutes. Uncover; bake 25 minutes longer or until bubbly. Let stand for 15 minutes before cutting. Sprinkle with parsley."
    ],
    time: 90, // in minutes
    servings: 12,
    difficulty: "medium",
    cuisine: "Italian",
    mealType: "dinner",
    dietaryInfo: [],
    rating: 4.9,
    reviews: [
      { user: "pasta_fanatic", comment: "This is exactly how my Italian grandmother made it. Perfect!", rating: 5 },
      { user: "dinner_winner", comment: "Everyone cleaned their plates. Will definitely make again!", rating: 5 },
      { user: "food_critic101", comment: "Classic recipe done right. I added some red wine to the sauce for depth.", rating: 5 }
    ],
    author: "RecipePal Team",
    createdAt: "2023-09-15",
    labels: ["pasta", "Italian", "beef", "comfort food", "baked"]
  }
];

export const featuredRecipes = [1, 3, 5]; // IDs of featured recipes

export const cuisineTypes = [
  "American",
  "Italian",
  "Mexican",
  "Thai",
  "Chinese",
  "Indian",
  "Japanese",
  "French",
  "Mediterranean",
  "Middle Eastern",
  "Greek",
  "Korean",
  "Vietnamese",
  "Spanish",
  "Fusion"
];

export const mealTypes = ["breakfast", "lunch", "dinner", "dessert", "snack", "appetizer", "drink"];

export const dietaryOptions = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "keto",
  "paleo",
  "low-carb",
  "low-fat",
  "low-sodium",
  "sugar-free"
];

export const difficultyLevels = ["easy", "medium", "hard"];

// Function to get recipe by ID
export const getRecipeById = (id) => {
  return recipes.find(recipe => recipe.id === parseInt(id));
};

// Function to filter recipes
export const filterRecipes = (filters) => {
  return recipes.filter(recipe => {
    // Check if search term matches title or description
    if (filters.searchTerm && !recipe.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
      !recipe.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }

    // Check cuisine filter
    if (filters.cuisine && filters.cuisine !== "all" && recipe.cuisine !== filters.cuisine) {
      return false;
    }

    // Check meal type filter
    if (filters.mealType && filters.mealType !== "all" && recipe.mealType !== filters.mealType) {
      return false;
    }

    // Check dietary filter
    if (filters.dietary && filters.dietary !== "all" && !recipe.dietaryInfo.includes(filters.dietary)) {
      return false;
    }

    // Check difficulty filter
    if (filters.difficulty && filters.difficulty !== "all" && recipe.difficulty !== filters.difficulty) {
      return false;
    }

    // Check time filter (max minutes)
    if (filters.maxTime && recipe.time > parseInt(filters.maxTime)) {
      return false;
    }

    return true;
  });
};
