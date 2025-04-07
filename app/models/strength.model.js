module.exports = (sequelize, Sequelize) => {
  const Strength = sequelize.define("strength", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    score: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Strength;
}; 