const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Image = sequelize.define('Images', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    P_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Image_URL: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'Images'
});

module.exports = Image;