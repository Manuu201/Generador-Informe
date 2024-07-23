module.exports = (sequelize, DataTypes) => {
  const Specialist = sequelize.define('Specialist', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // 0 for member, 1 for manager
      validate: {
        isIn: [[0, 1]], // Only allow 0 or 1
      },
    },
    machineId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Machines',
        key: 'id',
      },
      allowNull: false,
    },
  });

  return Specialist;
};
