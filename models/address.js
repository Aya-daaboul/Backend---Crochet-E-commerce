module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
      ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      O_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'ID'
        }
      },
      City: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      Building: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      Floor: {
        type: DataTypes.STRING(50)
      }
    }, {
      tableName: 'Address',
      timestamps: false
    });
  
    Address.associate = (models) => {
      Address.belongsTo(models.Order, { foreignKey: 'O_id', onDelete: 'CASCADE' });
    };
  
    return Address;
  };