const { Sequelize } = require('sequelize');
const config = require('../config/config.json')['development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Machine = require('./machine')(sequelize, Sequelize);
db.Task = require('./task')(sequelize, Sequelize);
db.Observation = require('./observation')(sequelize, Sequelize);
db.Photo = require('./photo')(sequelize, Sequelize);
db.Line = require('./line')(sequelize, Sequelize);
db.Specialist = require('./specialist')(sequelize, Sequelize);

// Define associations here if needed

module.exports = db;
