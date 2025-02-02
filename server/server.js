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
// (1) Move session secret word to .env file
// (2) Add log out button to log user out and deauthenticate user session
// (3) Remove miscellaneous code
// (4) Finish Google Authentication

const app = express();
const port = 5000;
const saltRounds = 10;

// load environment variables from .env file
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

// session cookie
app.use(session({
  secret: "TOPSECRETWORD",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: false,
    sameSite: "lax",
    httpOnly: true
  }
}));

// setup passport for authentication
app.use(passport.initialize());
// initalize user session (for cookies)
app.use(passport.session());

// Create database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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

// return data to React.js frontend 
// regarding logged in status
app.get('/session-data', (req, res) => {

  console.log("Session Data: ", req.session);

  let isLoggedIn = req.isAuthenticated();

  res.json({ isLoggedIn: isLoggedIn, user: req.user });
  if (isLoggedIn) {
    console.log(req.user);
  }
});


//////////////////////////////////////////////////
// Handle Signup POST request                   //
//////////////////////////////////////////////////
app.post('/signup', async (req, res) => {
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

        return res.json({ message: "User registered successfully.", username: user.username });
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
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
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


passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      // Adjusted for MySQL result format
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
        return cb("User not found");  // No user found
      }
    } catch (err) {
      console.log(err);
      return cb(err);  // Return error if query fails
    }
  })
);



passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});


app.listen(port, () => {
  console.log('Server is running on port 5000');
});