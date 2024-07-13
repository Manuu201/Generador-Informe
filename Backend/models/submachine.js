module.exports = (sequelize, DataTypes) => {
    const Submachine = sequelize.define('Submachine', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      machineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return Submachine;
  };