import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

const app = express();
const port = 5000;
const saltRounds = 10;

// Middleware
app.use(cors()); // enable cross-origin referencesharing (CORS)
app.use(express.json()); // Allow JSON body parsing
dotenv.config(); // load environment variables from .env file

// session cookie
app.use(session({
  secret: "TOPSECRETWORD",
  resave: false, // research how to persist cookies to data base
  saveUninitalized: true
}));

// setup passport for authentication
app.use(passport.initialize);
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

app.get('/test-login', (req, res) => {
  isLoggedIn = req.isAuthenticated();
  // return data to React.js frontend
});

app.get('/', (req, res) => {
  res.send('<h1>Recipe Website Server</h1>');
});

app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Handle user signup
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

        res.status(201).json({ message: 'User registered successfully' });
      }
    });


  } catch (error) {
    console.error('Error signing up user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/login', async (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare hashed password (loginPassword, hashedPassword)
    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', username: user[0].username });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// register 
passport.use(new Strategy(function verify(username, password, cb) {

}));

app.listen(port, () => {
  console.log('Server is running on port 5000');
});
