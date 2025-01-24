// server/server.js
import express from 'express';

const app = express();

// Serve static files from 'public' folder
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Paintball FPS Server</h1>');
});

// Start server
server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
