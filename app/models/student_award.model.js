// app/models/student_award.model.js
module.exports = (sequelize, Sequelize) => {
  const Student_award = sequelize.define("student_award", {
    studentid: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

    awardid: {
            type: Sequelize.INTEGER,
      },
    
    
    dateredeemed: {
            type: Sequelize.DATE,
        },
   
  });

    return Student_award;
};
