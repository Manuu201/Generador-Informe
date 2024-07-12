module.exports = (sequelize, DataTypes) => {
    const Machine = sequelize.define('Machine', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return Machine;
  };
  