const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const sequelize = require('./config/db');  // Import the sequelize instance 🛠️
require('dotenv').config();  // Load .env variables 🔑

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());  // For handling CORS 🌐
app.use(express.json());  // Middleware to parse incoming JSON requests 📄

// Basic route for testing 🚀
app.get('/', (req, res) => {
  res.send('Hello World! 🌍');
});

// Example of a route to handle user login (JWT example) 🔑
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query database for matching user credentials 🔍
    const [user] = await sequelize.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      {
        replacements: [username, password],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (user) {
      // If user found, generate a JWT (for simplicity, just a sample JWT response) 🛡️
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials ❌' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error 🛑' });
  }
});

// Sync database and start the server 🔄
sequelize.sync().then(() => {
  console.log('Database synchronized successfully! ✅');
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} 🌍`);
  });
}).catch((error) => {
  console.error('Error syncing database:', error);
});