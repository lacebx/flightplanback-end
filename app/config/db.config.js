module.exports = {
  HOST: "project2.eaglesoftwareteam.com", 
  USER: "t82024",
  PASSWORD: "CS@oc2024t8",
  DB: "flight-plan-t8",
  dialect: "mysql",
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
