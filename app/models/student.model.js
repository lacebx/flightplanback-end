// app/models/flightplan.model.js
module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("student", {
    StudentID: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

    name: {
            type: Sequelize.STRING,
            allowNull: false, 
        },

    email: {
        type: Sequelize.STRING,
         allowNull: false, 
    },

    graduationdate: {
            type: Sequelize.DATE,
            allowNull: false, 
    },
    
    
    major: {
            type: Sequelize.STRING,
            allowNull: false, 
      },
    
    cliftonstrengths: {
            type: Sequelize.STRING,
            allowNull: false, 
      },
    
    pointsawarded: {
            type: Sequelize.INTEGER,
            allowNull: false, 
      },
    
    pointsused: {
            type: Sequelize.INTEGER,
            allowNull: false, 
      },
    
     pointavailable: {
            type: Sequelize.INTEGER,
            allowNull: false, 
        },
    
      badgesreceived: {
            type: Sequelize.STRING,
            allowNull: false, 
        },

   
  });

  return Student;
};
