module.exports = (sequelize, DataTypes) => {
  const TaskCompletionRequest = sequelize.define('taskCompletionRequest', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    timestamps: true,
  });

  return TaskCompletionRequest;
};
