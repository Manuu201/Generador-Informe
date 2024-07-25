module.exports = (sequelize, DataTypes) => {
  const Submachine = sequelize.define('Submachine', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    machineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  // Definir la relación con el modelo Machine
  Submachine.associate = models => {
    Submachine.belongsTo(models.Machine, {
      foreignKey: 'machineId',
      as: 'machine'
    });
  };

  return Submachine;
};