const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  U_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'ID'
    }
  },
  Status: {
    type: DataTypes.ENUM('unconfirmed', 'confirmed', 'working on', 'to be delivered', 'delivered'),
    defaultValue: 'unconfirmed',
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
}, {
  timestamps: false,
  tableName: 'Orders',
});

module.exports = Order;