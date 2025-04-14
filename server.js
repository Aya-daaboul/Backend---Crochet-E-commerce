require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// Import models
const Product = require('./models/product');
const Image = require('./models/image');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection and model synchronization
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully');
        
        // Set up associations
        Product.hasMany(Image, { foreignKey: 'P_id', as: 'Images' });
        Image.belongsTo(Product, { foreignKey: 'P_id' });

        // Sync models
        return sequelize.sync({ alter: true });
    })
    .then(() => console.log('Models synchronized successfully'))
    .catch(err => console.error('Database error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: err.message
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});