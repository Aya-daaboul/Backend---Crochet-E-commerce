const Sequelize = require('sequelize');
require('dotenv').config(); // Load .env variables

// Create Sequelize instance with MySQL connection details from .env
const sequelize = new Sequelize(
  process.env.DB_NAME,    // Database name
  process.env.DB_USER,    // Database user
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST,  // MySQL host from .env
    port: process.env.DB_PORT,  // MySQL port from .env
    dialect: 'mysql',           // Dialect for MySQL
    logging: console.log,       // Log queries for debugging
    dialectOptions: {
      ssl: {
        require: true,          // For SSL connection with Aiven
        rejectUnauthorized: false, // Disable SSL certificate validation
      },
    },
  }
);

// Test the connection
const testConnection = async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connected successfully! ✅');
    } catch (error) {
      console.error('Unable to connect to the database: ❌', error);
    }
  };


// Run the connection test
testConnection();

module.exports = sequelize;
