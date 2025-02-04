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
db.student = require("./student.model.js")(sequelize, Sequelize);
db.experience = require("./experience.model.js")(sequelize, Sequelize);
db.experience_cliftonstrengths = require("./experience_cliftonstrengths.model.js")(sequelize, Sequelize);
db.flightplan_experience = require("./flightplan_experience.model.js")(sequelize, Sequelize);
db.major = require("./major.model.js")(sequelize, Sequelize);
db.student_badge = require("./student_badge.model.js")(sequelize, Sequelize);
db.badge = require("./badge.model.js")(sequelize, Sequelize);
db.student_award = require("./student_award.model.js")(sequelize, Sequelize);
db.task_cliftonstrengths = require("./task_cliftonstrengths.model.js")(sequelize, Sequelize);
db.admin = require("./admin.model.js")(sequelize, Sequelize);
db.task = require("./task.model.js")(sequelize, Sequelize);
db.event = require("./event.model.js")(sequelize, Sequelize);
db.task_major = require("./task_major.model.js")(sequelize, Sequelize);
db.award = require("./award.model.js")(sequelize, Sequelize);
db.document = require("./document.model.js")(sequelize, Sequelize);
db.experience_major = require("./experience_major.model.js")(sequelize, Sequelize);
db.cliftonstrengths = require("./cliftonstrengths.model.js")(sequelize, Sequelize);


module.exports = db;
