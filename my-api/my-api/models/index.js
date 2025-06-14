const { Sequelize } = require('sequelize');
const config = require('../config/config').development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: config.logging
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.Vehicle = require('./Vehicle')(sequelize, Sequelize);
db.Weather = require('./Weather')(sequelize, Sequelize);
db.Stop = require('./Stop')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);
db.Route = require('./Route')(sequelize, Sequelize);
db.RouteStop = require('./RouteStop')(sequelize, Sequelize);
db.AlternativeTrajectory = require('./AlternativeTrajectory')(sequelize, Sequelize);
db.Trip = require('./Trip')(sequelize, Sequelize);
db.TripAlternativeTrajectory = require('./TripAlternativeTrajectory')(sequelize, Sequelize);

// Connect tables that have associations
Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

module.exports = db;
