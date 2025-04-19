const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Reviews', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    P_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Description: {
        type: DataTypes.TEXT
    },
    Rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    }
}, {
    timestamps: false,
    tableName: 'Reviews'
});

module.exports = Review;
