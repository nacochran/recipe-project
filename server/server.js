//////////////////////////////////////////////////
// LIBRARIES & DEPENDENCIES
// Node.js is a variant of JavaScript that works on the back-end
// Node applications can be managed from the command line using the node-package-manager (NPM) command
// - express is a library built to make developing Node applications easier
// - body-parser
// - mysql12/promise is a library used for connecting to our MySQL DBMS 
// - cors is a library used to enable cross-origin reference sharing (CORS)
// - dotenv is a library used for extracting environment variables from a .env file
// - bcryptjs is a library used for encrypting passwords (using a hash algorithm + salting)
// - session is a library for express that enables us to easily create session cookies to manage user sessions
// - passport is the library we are using for mainstreaming the authentication process
// - passport-local is an extension of passport used for performing local authentication
// - passport-google-oauth2 is an extension of passport used for performing Google OAuth2 authentication
//////////////////////////////////////////////////

import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import config from "./config.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


// Back-end logic
import Database from './back_end_logic/infrastructure/database.js';
import User from './back_end_logic/app_logic/user.js';

//////////////////////////////////////////////////
// Initialize Express app                       //
//////////////////////////////////////////////////
const app = express();

//////////////////////////////////////////////////
// Setup Email Management System                //
//////////////////////////////////////////////////
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: config.mail.host,
  port: config.mail.port,
  secure: true,
  auth: {
    user: config.mail.user,
    pass: config.mail.password
  },
});

async function sendVerificationEmail(email, verificationCode) {
  try {
    await transporter.sendMail({
      from: `"Paintball.io" <no-reply@paintball.io>`,
      to: email,
      subject: "Verify Your Account",
      html: `<p>Here is your verification code: ${verificationCode}</p>`
    }, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    //console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}


//////////////////////////////////////////////////
// Middleware                                   //
//////////////////////////////////////////////////

// enable cross-origin reference sharing (CORS)
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));

// enable JSON format for data transfer
app.use(express.json());

// parses data passed through the URL
app.use(bodyParser.urlencoded({ extended: true }));

// create session cookie
app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1-day cookie
  })
);

app.use('/uploads', express.static('uploads'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage })

// setup passport for authentication
app.use(passport.initialize());
// initalize user session (for cookies)
app.use(passport.session());

//////////////////////////////////////////////////
// Create Database Connection                   //
//////////////////////////////////////////////////
const db = new Database(config);

await db.test_connection();

//////////////////////////////////////////////////
// Back-end API                                 //
// This provides an interface for the front-end //
// to have access to all the data managed by    //
// the back-end                                 //
// e.g.: app.get(), app.post(), etc.            //
//////////////////////////////////////////////////

//////////////////////////////////////////////////
// Provides an endpoint (/session-data) to      //
// access session data for authenticated users  //
//////////////////////////////////////////////////
app.get('/session-data', (req, res) => {
  if (!req.isAuthenticated()) {
    res.json({
      user: null
    });
  } else {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        avatar_url: req.user.avatar_url
      }
    });
  }
});

//////////////////////////////////////////////////
// Get user's public info                       //
//////////////////////////////////////////////////
app.get("/private-user-data/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch all fields (including private data like email)
    const rows = await db.get_verified_users({
      queryType: "username",
      filter: username,
      fields: ['*']
    });

    if (rows.length === 0) {
      res.json({
        error: "User not found"
      });
    } else {
      res.json({
        user: rows[0],
        error: null
      });
    }
  } catch (error) {
    console.error("Error fetching private user profile:", error.message);
    res.json({
      error: 'Internal Server Error'
    });
  }
});

app.get("/public-user-data/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch all fields (including private data like email)
    const rows = await db.get_verified_users({
      queryType: "username",
      filter: username,
      fields: ['*']
    });

    if (rows.length === 0) {
      res.json({
        error: "User not found"
      });
    } else {
      res.json({
        user: rows[0],
        error: null
      });
    }
  } catch (error) {
    console.error("Error fetching private user profile:", error.message);
    res.json({
      error: 'Internal Server Error'
    });
  }
});

app.post("/:username/update-settings", async (req, res) => {
  const username = req.params.username;
  const newData = req.body;

  try {
    // Call the database method
    const success = await db.update_user_by_username(username, newData);

    if (success) {
      req.user.username = newData.username;
      req.user.avatar_url = newData.avatar_url;
      req.user.email = newData.email;
      // req.user.password = newData.password;
      res.status(200).json({ message: "User settings updated successfully.", user: req.user });
    } else {
      res.status(404).json({ error: "User not found or nothing to update." });
    }
  } catch (error) {
    console.error("Error updating user settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const previousImage = req.body.previous_image_url;
  if (previousImage) {
    const previousImagePath = path.join(__dirname, 'uploads', previousImage);
    fs.unlink(previousImagePath, (err) => {
      if (err) {
        console.error('Error deleting previous image:', err);
      } else {
        console.log('Previous image deleted:', previousImage);
      }
    });
  }

  const imageUrl = `${req.file.filename}`;
  res.json({ message: 'Upload successful', imageUrl });
});

app.post('/create-recipe', async (req, res) => {
  const { title, description, imageUrl, difficulty, prepTime, cookTime, servings, calories, authorUsername, createdAt, isSpinoff, ingredients, instructions, tags } = req.body;

  // Validate inputs as needed (e.g., check if required fields are present)
  if (!title || !description || !authorUsername) {
    return res.status(400).json({ error: 'Title, description, and authorUsername are required' });
  }

  try {
    await db.create_recipe({
      title,
      description,
      imageUrl,
      difficulty,
      prepTime,
      cookTime,
      servings,
      calories,
      authorUsername,
      createdAt,
      isSpinoff,
      ingredients,
      instructions,
      tags
    }, (error, recipeId) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to create recipe' });
      }
      res.status(201).json({ message: 'Recipe created successfully', recipeId });
    });
  } catch (error) {
    console.error('Error handling create-recipe route:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/edit-recipe', async (req, res) => {
  const recipe = req.body;

  if (!recipe.id || !recipe.title || !recipe.description) {
    return res.status(400).json({ error: 'Recipe ID, title, and description are required' });
  }

  try {
    await db.edit_recipe(recipe.id, recipe, (error) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to update recipe' });
      }
      res.status(200).json({ message: 'Recipe updated successfully' });
    });
  } catch (error) {
    console.error('Error handling edit-recipe route:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get("/get-tags", async (req, res) => {
  try {
    const tags = await db.get_tags();
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

// TODO: generate slug from recipe name
app.get("/:username/recipes/:recipe_slug", async (req, res) => {
  const { username, recipe_slug } = req.params;

  try {
    const rows = await db.get_user_recipe(username, recipe_slug);

    if (rows.length === 0) {
      res.json({
        error: "recipe not found"
      });
    }
    else {
      res.json({
        data: rows[0]
      });
    }
  }
  catch (error) {
    console.error("Error fetching recipe:", error.message);
    res.json({
      error: 'Internal Server Error'
    });
  }
});

app.get("/recipes", async function (req, res) {
  const query = req.query;

  // Extract query params
  const tags = query.tags ? query.tags.split(',') : null;
  const title = query.title || null;
  const cookTime = query.cookTime || null;
  const average_rating = query.average_rating || null;
  const user = query.user || null;
  const difficulty = query.difficulty || null;
  const sortType = query.sort || null;
  const limit = query.limit || null;

  // console.log("Query:", query);
  // console.log("Tags:", tags);
  // console.log("Title:", title);
  // console.log("Cook Time:", cookTime);
  // console.log("Average Rating:", average_rating);

  try {
    // Build filter object dynamically
    // filters can be classified into three types:
    // hard : must match or contain item exactly
    // soft : use regex to match; sort by similarity
    // sort : used for sorting
    const filter = {};
    if (tags) filter.tags = tags;
    if (title) filter.title = title;
    if (cookTime) filter.cook_time = cookTime;
    if (average_rating) filter.average_rating = average_rating;
    if (user) filter.user = user;
    if (difficulty && difficulty != 'all') filter.difficulty = difficulty;

    const rows = await db.get_recipes({
      instructions: false,
      ingredients: false,
      reviews: false,
      tags: true,
      sortType: sortType,
      filter: filter,
      limit: limit,
      fields: ['*']
    });

    res.json({
      data: rows
    });
  } catch (error) {
    console.error("Error fetching /recipes:", error.message);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

app.post('/toggle-like', async (req, res) => {
  const { username, recipe_slug, like } = req.body;

  try {
    const updated_data = await db.toggle_like({ username: username, recipe_slug: recipe_slug, like: like });
    res.json({ error: null, user: req.user, likes: updated_data.likes });
  } catch (error) {
    console.error("Error in /toggle-like", error.message);
    res.json({ error: "Internal server error", user: req.user });
  }
});

app.post('/toggle-follow', async (req, res) => {
  const { follower_username, followee_username, following_state } = req.body;

  try {
    const updated_data = await db.toggle_follow({ follower_username: follower_username, followee_username: followee_username, following_state: following_state });
    res.json({ error: null, followers_count: updated_data.followers_count });
  } catch (error) {
    console.error("Error in /toggle-follow", error.message);
    res.json({ error: "Internal server error", user: req.user });
  }
});

// checks if a user has liked a recipe or not
app.get('/has-liked', async (req, res) => {
  const { username, recipe_slug } = req.query;

  try {
    const is_liked = await db.is_liked_by_user({ username: username, recipe_slug: recipe_slug });

    res.json({ liked: is_liked });
  } catch (error) {
    console.error("Error in /has-liked:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/is-following-user', async (req, res) => {
  const { follower_username, followee_username } = req.query;

  try {
    const is_following = await db.is_followed_by_user({ follower_username: follower_username, followee_username: followee_username });

    res.json({ is_following: is_following });
  } catch (error) {
    console.error("Error in /is-following-user", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/submit-review', async (req, res) => {
  const { comment, rating, user_id, recipe_slug } = req.body;

  if (!comment || !rating || !user_id || !recipe_slug) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await db.add_review({ comment, rating, user_id, recipe_slug });
    res.status(200).json({ message: 'Review submitted successfully' });
  } catch (err) {
    console.error('Error submitting review:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//////////////////////////////////////////////////
// Handle Signup POST request                   //
//////////////////////////////////////////////////
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({ error: "All fields are required", user: req.user });
  }

  try {
    const user = new User({ username: username, email: email, password: password });

    if (await user.is_email_unique(db)) {
      return res.json({ error: "Email already taken", user: req.user });
    } else if (await user.is_username_unique(db)) {
      return res.json({ error: "Username already taken", user: req.user });
    }

    await user.register(db, config.security.hashRounds, async function (verificationCode) {
      await sendVerificationEmail(email, verificationCode);

      return res.json({ message: "Signup successful! Please check your email for a verification code.", user: req.user });
    });

  } catch (error) {
    console.error("Error signing up user:", error.message);
    res.json({ error: "Internal server error", user: req.user });
  }
});

//////////////////////////////////////////////////
// Handle Login POST Request                    //
//////////////////////////////////////////////////
app.post('/login', (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {

    if (!user) {
      if (err == "not_verified") {
        return res.json({ err_code: err, error: "User not verified. Request new verification email.", user: req.user, message: null });
      } else if (err == "user_not_found") {
        return res.json({ error: "No user found with that username.", user: req.user, message: null });
      } else if (err = "invalid_password") {
        return res.json({ error: "Incorrect password.", user: req.user, message: null });
      } else {
        // general case
        return res.json({ error: err, user: req.user, message: null });
      }
    }

    req.login(user, (err) => {
      if (err) {
        return res.json({ error: "Error logging in", user: req.user, message: null });
      } else {
        return res.json({ error: null, user: req.user, message: "Successful Login" });
      }
    });
  })(req, res, next);
});

//////////////////////////////////////////////////
// Handle Logout POST Request                   //
//////////////////////////////////////////////////
app.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.json({ message: "Logout failed" });
    else return res.json({ message: "Logout successful!" });

    // req.session.destroy(() => {
    // });
  });
});

// verifies a registered user (unverified_users table --> users table)
app.post("/verify", async (req, res) => {
  const code = req.body.verificationCode;

  if (!code) {
    return res.render({ error: "Invalid verification code." });
  }

  try {
    await db.verify_user({ code: code }, (success) => {
      if (success) {
        res.json({ user: req.user, error: null, message: "Account verified! You can now login!" });
      } else {
        return res.json({ user: req.user, err_code: "invalid_code", error: "Invalid code.", message: null });
      }
    });

  } catch (error) {
    console.error("Error verifying user:", error.message);
    res.json({ error: "Internal server error." });
  }
});

// resend verification
app.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  try {

    await db.resend_verification_email({ email: email }, async (success, verificationCode) => {
      if (success) {
        res.json({
          message: "A new verification email has been sent.",
          error: null,
          user: req.user
        });

        await sendVerificationEmail(email, verificationCode);
      } else {
        res.json({
          error: "No unverified account found with this email.",
          message: null,
          user: req.user
        });
      }
    });
  } catch (error) {
    console.error("Error resending verification email:", error.message);
    res.json({
      error: "Internal server error.",
      message: null,
      user: req.user
    });
  }
});

// update user stats at regular intervals
db.update_count_stats();
setInterval(() => {
  db.update_count_stats();
}, 2 * 60 * 60 * 1000); // 2 hours in milliseconds



// Set up Passport authentication
passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const user = new User({ username: username, password: password });

      // Check if user is in unverified_users
      const unverifiedUsers = await user.match_unverified_users(db);

      if (unverifiedUsers.length > 0) {
        return cb("not_verified", false);
      }

      const users = await user.match_verified_users(db);

      if (users.length === 0) {
        return cb("user_not_found", false);
      }

      bcrypt.compare(password, users[0].password, (err, valid) => {
        if (valid) return cb(null, users[0]);
        return cb("invalid_password", false);
      });
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

// deleted users from unverified_users table after 7 days
db.refresh_unverified_users();

//////////////////////////////////////////////////
// Recipe Management Routes                     //
//////////////////////////////////////////////////

app.post('/delete-recipe/:recipeId', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const recipeId = req.params.recipeId;

    // Verify that the user owns the recipe
    const [recipe] = await db.db.query(
      "SELECT creator FROM recipes WHERE id = ?",
      [recipeId]
    );

    if (recipe.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (recipe[0].creator !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this recipe' });
    }

    // Delete the recipe
    const success = await db.delete_recipe(recipeId);

    if (success) {
      res.json({ message: 'Recipe deleted successfully' });
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//////////////////////////////////////////////////
// Run Server                                   //
//////////////////////////////////////////////////
const server = app.listen(config.app.port, () => {
  console.log(`Server running on port ${config.app.port}`);
});