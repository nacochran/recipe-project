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
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";

// TODO: 
// (1) Finish Google Authentication
// (2) Remove miscellaneous code
// (3) TODO: Perform rerouting effectively so that /profile is inaccesible to users not logged in, etc.
// (4) Ensure that you can't login with "google" for users who used google

//////////////////////////////////////////////////
// General Config Variables                     //
//////////////////////////////////////////////////
const app = express();
const port = 5000;
const saltRounds = 10; // for bcrypt encryption algorithm

//////////////////////////////////////////////////
// Environment Variables                        //
//////////////////////////////////////////////////
dotenv.config();


//////////////////////////////////////////////////
// Middleware                                   //
//////////////////////////////////////////////////

// enable cross-origin reference sharing (CORS)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// enable JSON format for data transfer
app.use(express.json());

// parses data passed through the URL
app.use(bodyParser.urlencoded({ extended: true }));

// create session cookie
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day length cookie
    secure: false,
    sameSite: "lax",
    httpOnly: true
  }
}));

// setup passport for authentication
app.use(passport.initialize());
// initalize user session (for cookies)
app.use(passport.session());

//////////////////////////////////////////////////
// Create Database Connection                   //
//////////////////////////////////////////////////
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Test the connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Connected to the MySQL database!');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
})();

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
  let isLoggedIn = req.isAuthenticated();

  if (isLoggedIn) {
    res.json({ isLoggedIn: isLoggedIn, user: req.user });
  } else {
    res.json({ isLoggedIn: isLoggedIn, user: null });
  }
});

//////////////////////////////////////////////////
// Get user's public info                       //
//////////////////////////////////////////////////
app.get('/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await db.query('SELECT username, email FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//////////////////////////////////////////////////
// Handle Signup POST request                   //
//////////////////////////////////////////////////
// TODO: /register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  try {
    // Check if the email already exists
    const [existingEmail] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const [existingUsername] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    if (existingUsername.length > 0) {
      return res.status(400).json({ message: 'Username already registered' });
    }

    // decrypt password
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.log("Error hashing password:", err);
      } else {
        // Insert the new user
        await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash]);

        return res.json({ message: "User registered successfully. Check email for verification link." });
      }
    });


  } catch (error) {
    console.error('Error signing up user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//////////////////////////////////////////////////
// Handle Login POST Request                    //
//////////////////////////////////////////////////
app.post('/login', (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err == "user_not_found") {
      return res.json({ message: "Wrong password" });
    }
    if (!user) {
      return res.status(400).json({ message: info?.message || "Invalid login attempt" });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging in" });
      }

      // Ensure session is fully saved before responding
      req.session.save(() => {
        return res.json({ message: "Login successful", username: user.username });
      });
    });
  })(req, res, next);
});

//////////////////////////////////////////////////
// Handle Logout POST Request                   //
//////////////////////////////////////////////////
app.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to destroy session' });
      }
      res.clearCookie('connect.sid'); // Ensure session cookie is removed
      return res.json({ message: 'Logged out successfully' });
    });
  });
});


app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/check",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);



//////////////////////////////////////////////////
// Setups local authentication strategy         //
//////////////////////////////////////////////////
passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
        username,
      ]);
      if (rows.length > 0) {  // Check if any rows were returned
        const user = rows[0]; // Get the first user object
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);  // Return user if passwords match
            } else {
              return cb(null, false);  // Return false if passwords don't match
            }
          }
        });
      } else {
        return cb("user_not_found");  // No user found
      }
    } catch (err) {
      console.log(err);
      return cb(err);  // Return error if query fails
    }
  })
);

//////////////////////////////////////////////////
// Setups GoogleOAuth2 authentication strategy  //
//////////////////////////////////////////////////

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/check",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    (accessToken, refreshToken, profile, cb) => {
      try {
        const insertUserPromise = new Promise(async (resolve, reject) => {
          const result = await db.query("SELECT * FROM users WHERE email = ?", [profile.email]);
          if (result.rows.length === 0) {
            await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [profile.email, "google"]);
            const [getUserRows] = await db.query("SELECT * from users WHERE email = ?", [profile.email]);

            resolve(getUserRows[0]);
          } else {
            resolve(result.rows[0]);
          }
        });

        insertUserPromise
          .then((user) => {
            console.log(user);
            return cb(null, user);
          })
          .catch((error) => {
            console.error("Error during user insertion:", error);
            return cb(error);
          });
      } catch (err) {
        return cb(err);
      }
    }
  )
);


//////////////////////////////////////////////////
// Encodes/decodes user session data            //
//////////////////////////////////////////////////
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});


//////////////////////////////////////////////////
// Runs app on specified port                   //
//////////////////////////////////////////////////
app.listen(port, () => {
  console.log('Server is running on port 5000');
});