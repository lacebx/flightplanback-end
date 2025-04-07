const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Use consistent naming, "flightplan" singular form
db.flightplan = require("./flightplan.model.js")(sequelize, Sequelize);
db.experience = require("./experience.model.js")(sequelize, Sequelize);
db.badge = require("./badge.model.js")(sequelize, Sequelize);
db.task = require("./task.model.js")(sequelize, Sequelize);
db.event = require("./event.model.js")(sequelize, Sequelize);
db.award = require("./award.model.js")(sequelize, Sequelize);
db.document = require("./document.model.js")(sequelize, Sequelize);
db.registration = require("./registration.model.js")(sequelize, Sequelize);

db.user = require("./user.model.js")(sequelize, Sequelize);
db.strength = require("./strength.model.js")(sequelize, Sequelize);
db.taskCompletion = require("./taskCompletion.model.js")(sequelize, Sequelize);
db.eventAttendance = require("./eventAttendance.model.js")(sequelize, Sequelize);

// Define associations
db.user.hasMany(db.taskCompletion, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.taskCompletion.belongsTo(db.user, { foreignKey: 'userId' });

db.user.hasMany(db.eventAttendance, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.eventAttendance.belongsTo(db.user, { foreignKey: 'userId' });

db.user.hasMany(db.strength, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.strength.belongsTo(db.user, { foreignKey: 'userId' });

db.user.hasMany(db.registration, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.registration.belongsTo(db.user, { foreignKey: 'userId' });

db.event.hasMany(db.registration, { foreignKey: 'eventId', onDelete: 'CASCADE' });
db.registration.belongsTo(db.event, { foreignKey: 'eventId' });

module.exports = db;
