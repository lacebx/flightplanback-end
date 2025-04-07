module.exports = (sequelize, Sequelize) => {
  const EventAttendance = sequelize.define("eventAttendance", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    eventId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    attended: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return EventAttendance;
}; 