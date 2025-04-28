const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  O_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Orders',
      key: 'ID'
    }
  },
  P_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Product',
      key: 'ID'
    }
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
}, {
  timestamps: false,
  tableName: 'OrderItems',
});

module.exports = OrderItem;
