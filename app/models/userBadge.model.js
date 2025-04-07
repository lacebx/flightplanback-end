module.exports = (sequelize, Sequelize) => {
  const UserBadge = sequelize.define("userBadge", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    badgeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    earned: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return UserBadge;
}; 