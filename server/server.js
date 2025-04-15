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
  origin: "http://localhost:3000",
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
      user: req.user
    });
  }
});

//////////////////////////////////////////////////
// Get user's public info                       //
//////////////////////////////////////////////////
app.get("/user/:username", async (req, res) => {
  const { username } = req.params;
  try {
      const rows = await db.get_verified_users({
      queryType: "username",
      filter: username,
      fields: ['username', 'email']
    });

    if (rows.length === 0) {
      res.json({
        error: "User not found"
      });
    } else {
      res.json({
        user: req.user,
        data: rows,
        error: null
      });
    }
  } 
  catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.json({
      error: 'Internal Server Error'
    });
  }
});

//////////////////////////////////////////////////
// Handle Signup POST request                   //
//////////////////////////////////////////////////
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({ error: "All fields are required", user: req.user });
  }

  try {
    const user = new User({ username: username, email: email, password: password });

    if (await user.is_username_unique(db)) {
      return res.json({ error: "Username already taken", user: req.user });
    } else if (await user.is_email_unique(db)) {
      return res.json({ error: "Email already taken", user: req.user });
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
// Get recipe info                              //
//////////////////////////////////////////////////

app.get("/:username/:recipename", async (req, res) => {
  const { username } = req.params;
  const { recipename } = req.params;
  try{
    const rows = await db.get_user_recipe({
      queryType: "name",
      filter: [recipename, username], 
      fields: ["id", "name", "creator"]
    });

    if (rows.length === 0){
      res.json({
        error: "recipe not found"
      });
    }
    else {
      res.json({
        data: rows
      });
    }
  }
  catch (error)
  {
    console.error("Error fetching user profile:", error.message);
    res.json({
      error: 'Internal Server Error'
    });
  }
});

app.get("/recipes", async function(req, res){
  const query = req.query;
  const tags = query.tags.split(','); //swap the ',' with what your using for the serperator
  const title = query.title;
  const cookTime = query.cookTime;
  const average_rating = query.average_rating;
  if(query === undefined){
    res.json({
      error: 'incorrect call try /recipe/?tag={value}'
    });
  }
  console.log(query)
  console.log(tags)
  console.log(title)
  console.log(cookTime)
  console.log(average_rating)
  try{
    const rows = await db.get_tag_recipes({
      queryType: "",
      filter: [tags, title, cookTime, average_rating],
      fields: ["id", "title", "cookTime"]
    });

    if (rows.length === 0){
      res.json({
        error: "recipe not found"
      });
    }
    else{
      res.json({
        data: "This is some test Data",
        data: rows
      });
    }
  }
  catch (error){
    console.error("Error fetching /recipe/?tag={}:", error.message);
    res.json({
      error: 'Internal Server Error Keto'
    });
  }
});

//////////////////////////////////////////////////
// Run Server                                   //
//////////////////////////////////////////////////
const server = app.listen(config.app.port, () => {
  console.log(`Server running on port ${config.app.port}`);
});