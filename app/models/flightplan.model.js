// app/models/flightplan.model.js
module.exports = (sequelize, Sequelize) => {
  const Flightplan = sequelize.define("flightplan", {
    flightplanID: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

    studentID: {
            type: Sequelize.INTEGER,
            allowNull: false, 
        },

    Semester: {
      type: Sequelize.STRING,
    },

    SemestersFromGraduation: {
            type: Sequelize.INTEGER,
            allowNull: false, 
    },
    
    
    Status: {
            type: Sequelize.ENUM,
            allowNull: false, 
        },
   
  });

  return Flightplan;
};
