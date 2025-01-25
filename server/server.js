import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

// Middleware
// enable cross-origin referencesharing (CORS)
app.use(cors());

// load environment variables from .env file
dotenv.config();

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

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
