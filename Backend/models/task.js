module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      machineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return Task;
  };
  