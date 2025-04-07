module.exports = (sequelize, Sequelize) => {
  const UserPreference = sequelize.define("userPreference", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    preferenceKey: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    preferenceValue: {
      type: Sequelize.STRING,
    },
  });

  return UserPreference;
}; 