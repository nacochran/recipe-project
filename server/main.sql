DROP DATABASE IF EXISTS recipe_db;
CREATE DATABASE recipe_db;

USE recipe_db;

-- Users who are registered but not verified yet
CREATE TABLE unverified_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    verification_code CHAR(6) NOT NULL,
    token_expires_at DATETIME NOT NULL,  
    created_at DATETIME NOT NULL DEFAULT NOW()  
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    avatar_url VARCHAR(255),
    display_name VARCHAR(255),
    bio VARCHAR(1000) DEFAULT '',
    -- Stats
    joined_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    recipe_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    followers_count INT DEFAULT 0,
    total_likes INT DEFAULT 0,
    -- Settings
    newsletter_notification BOOLEAN DEFAULT 0,
    comments_notification BOOLEAN DEFAULT 0,
    new_followers_notification BOOLEAN DEFAULT 0,
    public_profile_preference BOOLEAN DEFAULT 1,
    show_email_preference BOOLEAN DEFAULT 0
);

CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,  
  slug VARCHAR (300) NOT NULL,
  title VARCHAR(300) NOT NULL,
  description VARCHAR(1000),
  image_url VARCHAR(255),
  difficulty VARCHAR(50),
  prep_time INT,
  cook_time INT,
  servings INT,
  cal_count INT,
  -- times_viewed INT DEFAULT 0,
  average_rating FLOAT DEFAULT 0,
  likes INT DEFAULT 0,
  creator INT NOT NULL,
  created_at DATE NOT NULL,
  is_spinoff BOOLEAN DEFAULT 0,
  FOREIGN KEY (creator) REFERENCES users (id),
  UNIQUE (title, creator)
);

CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT,
  user_id INT,
  FOREIGN KEY (recipe_id) REFERENCES recipes (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE spinoffs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_recipe_id INT NOT NULL,
  derivative_recipe_id INT NOT NULL,
  FOREIGN KEY (original_recipe_id) REFERENCES recipes (id),
  FOREIGN KEY (derivative_recipe_id) REFERENCES recipes (id)
);

CREATE TABLE recipe_ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT NOT NULL,
  ingredient_name VARCHAR(250),
  quantity VARCHAR(100),
  unit_type VARCHAR(100),
  FOREIGN KEY (recipe_id) REFERENCES recipes (id)
);

CREATE TABLE recipe_instructions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT NOT NULL,
  instruction_number INT NOT NULL,
  instruction_text VARCHAR(1024),
  FOREIGN KEY (recipe_id) REFERENCES recipes (id)
);

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(128) NOT NULL UNIQUE
);

CREATE TABLE recipe_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    tag_id INT NOT NULL,
    UNIQUE (recipe_id, tag_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes (id),
    FOREIGN KEY (tag_id) REFERENCES tags (id)
);

CREATE TABLE recipe_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  recipe_id INT,
  comment VARCHAR(1000),
  rating FLOAT,
  creation_date DATE,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

CREATE TABLE follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  follower_id INT NOT NULL,
  followee_id INT NOT NULL,
  UNIQUE (follower_id, followee_id),
  FOREIGN KEY (follower_id) REFERENCES users(id),
  FOREIGN KEY (followee_id) REFERENCES users(id)
);


-- Insert Users
INSERT INTO users (username, password, email, avatar_url, display_name, bio, joined_date) VALUES
("alex_dalebout", "$2a$10$6rRs9P535wt9SfIAi2OmTOuSz4oMH/0c7hg8KEQQfB6XCTIaCpPMG", "alexdalebout@yahoo.com", "user2.jpg", "Alex Dalebout", "Co-creator of the project and food enthusiast.", "2025-01-01"),
("jane_doe", "$2a$10$abcd1234", "jane.doe@example.com", "user3.jpg", "Jane Doe", "Passionate home cook and recipe developer.", "2024-10-15"),
("nacochran", "$2a$10$VuziAdbvUHWUvO37PIXztOy8/2u1Jq4XqMVd89b/b0RMPCECN3W6u", "nacochranpb@gmail.com", "nathan_cochran.png", "Nathan Cochran", "I love learning new things!!!", "2025-4-16");

-- Insert Tags
INSERT INTO tags (label)
VALUES
  ("Healthy"),
  ("Quick"),
  ("Thai"),
  ("Comfort Food"),
  ("Vegetarian"),
  ("Low Carb"),
  ("Pasta"),
  ("Grilled"),
  ("Vegan"),
  ("Dairy-Free"),
  ("Spicy"),
  ("Gluten-Free"),
  ("Low-Calorie"),
  ("Dinner"),
  ("Lunch"),
  ("Salad"),
  ("Snack"),
  ("International"),
  ("Curry"),
  ("Baked"),
  ("Soup"),
  ("Light"),
  ("Tacos"),
  ("Asian"),
  ("Seafood"),
  ("Meat"),
  ("Cheese"),
  ("Low-Fat"),
  ("Fried");

-- Insert Recipes
INSERT INTO recipes (title, description, slug, image_url, difficulty, prep_time, cook_time, servings, cal_count, creator, created_at) VALUES
("Pancakes", "Fluffy and delicious pancakes.", "fluffy_and_delicious_pancakes", "pancakes_1.jpg", "easy", 5, 15, 4, 250, 1, "2024-07-10"),
("Chocolate Cake", "Rich and moist chocolate cake.", "rich_and_moist_chocolate_cake", "chocolate_cake_1.jpg", "medium", 20, 35, 8, 500, 2, "2024-08-22"),
("Vegetable Stir Fry", "Healthy and quick stir fry.", "healthy_and_quick_stir_fry", "stir_fry_1.jpg", "easy", 10, 10, 3, 200, 3, "2024-06-18");

-- Insert Recipe Ingredients, Instructions, and Tags
-- 1. Pancakes
INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit_type) VALUES
(1, 'flour', '1.5', 'cups'),
(1, 'milk', '1.25', 'cups'),
(1, 'egg', '1', 'large'),
(1, 'baking powder', '3.5', 'tsp'),
(1, 'salt', '0.5', 'tsp'),
(1, 'butter', '3', 'tbsp'),
(1, 'sugar', '1', 'tbsp');
INSERT INTO recipe_instructions (recipe_id, instruction_number, instruction_text) VALUES
(1, 1, 'In a large bowl, sift together the flour, baking powder, salt, and sugar.'),
(1, 2, 'Make a well in the center and pour in the milk, egg, and melted butter. Mix until smooth.'),
(1, 3, 'Heat a lightly oiled griddle or frying pan over medium-high heat.'),
(1, 4, 'Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake.'),
(1, 5, 'Brown on both sides and serve hot.');
INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
(1, 1),  -- Healthy
(1, 2),  -- Quick
(1, 3),  -- Easy
(1, 4),  -- Comfort Food
(1, 14), -- Dinner
(1, 15), -- Lunch
(1, 17); -- Snack



-- 2. Chocolate Cake
INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit_type) VALUES
(2, 'all-purpose flour', '1.75', 'cups'),
(2, 'granulated sugar', '2', 'cups'),
(2, 'unsweetened cocoa powder', '0.75', 'cups'),
(2, 'baking soda', '1.5', 'tsp'),
(2, 'baking powder', '1.5', 'tsp'),
(2, 'salt', '1', 'tsp'),
(2, 'eggs', '2', 'large'),
(2, 'milk', '1', 'cup'),
(2, 'vegetable oil', '0.5', 'cup'),
(2, 'vanilla extract', '2', 'tsp'),
(2, 'boiling water', '1', 'cup');
INSERT INTO recipe_instructions (recipe_id, instruction_number, instruction_text) VALUES
(2, 1, 'Preheat oven to 350°F (175°C). Grease and flour a 9x13 inch pan.'),
(2, 2, 'In a large bowl, combine the flour, sugar, cocoa, baking soda, baking powder, and salt.'),
(2, 3, 'Add eggs, milk, oil, and vanilla. Beat for 2 minutes on medium speed.'),
(2, 4, 'Stir in the boiling water (batter will be thin).'),
(2, 5, 'Pour batter into the prepared pan.'),
(2, 6, 'Bake 30 to 35 minutes in the preheated oven, until a toothpick inserted comes out clean.'),
(2, 7, 'Cool in the pan for 10 minutes, then remove to a wire rack to cool completely.');
INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
(2, 3),  -- Easy
(2, 4),  -- Comfort Food
(2, 19), -- Baked
(2, 17), -- Snack
(2, 26); -- Cheese (if using cream cheese frosting or dairy)



-- 3. Vegetable Stir Fry
INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit_type) VALUES
(3, 'broccoli florets', '1', 'cup'),
(3, 'carrot', '1', 'medium'),
(3, 'bell pepper', '1', 'medium'),
(3, 'soy sauce', '3', 'tbsp'),
(3, 'garlic', '2', 'cloves'),
(3, 'ginger', '1', 'tsp'),
(3, 'vegetable oil', '2', 'tbsp'),
(3, 'cornstarch', '1', 'tsp'),
(3, 'water', '0.25', 'cup');
INSERT INTO recipe_instructions (recipe_id, instruction_number, instruction_text) VALUES
(3, 1, 'Wash and chop all vegetables into bite-sized pieces.'),
(3, 2, 'Heat vegetable oil in a large skillet or wok over medium-high heat.'),
(3, 3, 'Add garlic and ginger, stir-fry for 30 seconds until fragrant.'),
(3, 4, 'Add carrots and broccoli. Stir-fry for 3–4 minutes.'),
(3, 5, 'Add bell pepper and stir-fry for another 2 minutes.'),
(3, 6, 'Mix soy sauce, water, and cornstarch in a small bowl, then pour over the vegetables.'),
(3, 7, 'Cook for 1–2 more minutes, until the sauce thickens and coats the vegetables.'),
(3, 8, 'Serve hot over rice or noodles.');
INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
(3, 1),  -- Healthy
(3, 2),  -- Quick
(3, 3),  -- Easy
(3, 5),  -- Vegetarian
(3, 9),  -- Vegan
(3, 10), -- Dairy-Free
(3, 22), -- Asian
(3, 14); -- Dinner

-- Insert Recipe Reviews
INSERT INTO recipe_reviews (user_id, recipe_id, comment, rating, creation_date) VALUES
(2, 1, "Best pancakes ever!", 5, "2025-02-10"),
(3, 2, "Loved this chocolate cake, so rich!", 4, "2025-03-15");
