const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Address = sequelize.define(
  "Address",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    U_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    O_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    City: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Building: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Floor: {
      type: DataTypes.STRING(50),
    },
  },
  {
    timestamps: false,
    tableName: "Address",
  }
);

module.exports = Address;
