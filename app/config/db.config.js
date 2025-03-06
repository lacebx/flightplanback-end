module.exports = {
  HOST: "127.0.0.1",
  USER: "root",
  PASSWORD: "",
  DB: "eagleflightplan",
  PORT: 3307,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
