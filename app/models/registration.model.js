module.exports = (sequelize, Sequelize) => {
  const Registration = sequelize.define("registration", {
    registrationId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true, // Optional if users are not logged in
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Registration;
}; 