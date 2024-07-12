module.exports = (sequelize, DataTypes) => {
    const Observation = sequelize.define('Observation', {
      note: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      machineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return Observation;
  };
  