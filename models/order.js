const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define(
  "Order",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    U_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "ID",
      },
    },
    Status: {
      type: DataTypes.ENUM(
        "unconfirmed",
        "confirmed",
        "working on",
        "to be delivered",
        "delivered",
        "cancelled"
      ),
      defaultValue: "unconfirmed",
    },

    TotalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: true,
    tableName: "Orders",
  }
);

module.exports = Order;
