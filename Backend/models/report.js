// models/Report.js
module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('Report', {
      machineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      observations: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });
  
    Report.associate = (models) => {
      // Define associations if necessary
      Report.belongsTo(models.Machine, { foreignKey: 'machineId' });
    };
  
    return Report;
  };
  