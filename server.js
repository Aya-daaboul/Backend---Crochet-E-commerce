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
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

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
    
    User.hasMany(Address, { foreignKey: 'U_id' });
    Address.belongsTo(User, { foreignKey: 'U_id' });

    // Order relations
    User.hasMany(Order, { foreignKey: 'U_id' });
    Order.belongsTo(User, { foreignKey: 'U_id' });

    Order.hasMany(OrderItem, { foreignKey: 'O_id', as: 'items' });
    OrderItem.belongsTo(Order, { foreignKey: 'O_id' });

    Product.hasMany(OrderItem, { foreignKey: 'P_id' });
    OrderItem.belongsTo(Product, { foreignKey: 'P_id' });
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
app.use('/api/orders', require('./routes/orderRoutes'));


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