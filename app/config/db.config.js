module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "password",
  DB: "eagleflightplan",
  dialect: "mysql",
  port: 3307,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
