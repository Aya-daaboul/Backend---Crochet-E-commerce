const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Description: {
        type: DataTypes.TEXT
    },
    Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    isNew: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isLimited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Discount: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.00
    },
    Category: {
        type: DataTypes.ENUM('bags', 'keychains', 'amigurumi', 'crochet bouquet', 'mug coasters'),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'Product'
});


module.exports = Product;