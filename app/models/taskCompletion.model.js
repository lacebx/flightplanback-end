module.exports = (sequelize, Sequelize) => {
  const TaskCompletion = sequelize.define("taskCompletion", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    taskId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    completed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return TaskCompletion;
}; 