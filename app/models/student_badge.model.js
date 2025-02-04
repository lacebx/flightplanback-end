// app/models/student_badge.model.js
module.exports = (sequelize, Sequelize) => {
  const Student_badge = sequelize.define("student_badge", {
    studentid: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

    badgeid: {
            type: Sequelize.INTEGER,
      },
    
    
    dateearned: {
            type: Sequelize.DATE,
        },
   
  });

    return Student_badge;
};
