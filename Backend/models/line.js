module.exports = (sequelize, DataTypes) => {
    const Line = sequelize.define('Line', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return Line;
  };
  