// app/models/flightplan_experience.model.js
module.exports = (sequelize, Sequelize) => {
  const Flightplan_experience = sequelize.define("flightplan_experience", {
    flightplanid: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

  experienceid: {
            type: Sequelize.INTEGER,
            allowNull: false, 
      },
  
  status: {
            type: Sequelize.STRING, 
      },
  
  completiondate: {
            type: Sequelize.DATE,
      },
  
  reflexiontext: {
            type: Sequelize.TEXT,
      },
  
  approvedby: {
            type: Sequelize.INTEGER, 
      },
  
  pointsearned: {
            type: Sequelize.INTEGER,
        },
   
  });

    return Flightplan_experience;
};
