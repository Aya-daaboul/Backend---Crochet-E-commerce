require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Import models
const Product = require('./models/product');
const Image = require('./models/image');
const User = require('./models/user');
const Review = require('./models/review');
const Address = require('./models/address');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up associations DIRECTLY (no model.associate)
const setupAssociations = () => {
    // Product relations
    Product.hasMany(Image, { foreignKey: 'P_id', as: 'Images' });
    Image.belongsTo(Product, { foreignKey: 'P_id' });
    
    Product.hasMany(Review, { foreignKey: 'P_id', as: 'Reviews' });
    Review.belongsTo(Product, { foreignKey: 'P_id' });
    
    // User relations
    User.hasMany(Review, { foreignKey: 'U_id' });
    Review.belongsTo(User, { foreignKey: 'U_id' });
    
    User.hasMany(Address, { foreignKey: 'U_id' });
    Address.belongsTo(User, { foreignKey: 'U_id' });
};

// Initialize database WITHOUT altering structure
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');
        
        setupAssociations();
        
        // Only sync without altering existing tables
        await sequelize.sync();
        console.log('🔄 Models synchronized');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/address', require('./routes/addressRoutes'));

app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});