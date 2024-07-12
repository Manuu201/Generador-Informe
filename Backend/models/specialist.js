module.exports = (sequelize, DataTypes) => {
    const Specialist = sequelize.define('Specialist', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specialty: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    });
  
    return Specialist;
  };
  