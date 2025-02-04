// app/models/task_cliftonstrengths.model.js
module.exports = (sequelize, Sequelize) => {
  const Task_cliftonstrengths = sequelize.define("task_cliftonstrengths", {
    taskid: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

    strengthid: {
            type: Sequelize.INTEGER,
        },
   
  });

    return Task_cliftonstrengths;
};
