module.exports = (sequelize, DataTypes) => {
    const Photo = sequelize.define('Photo', {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      machineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      submachineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return Photo;
  };
  