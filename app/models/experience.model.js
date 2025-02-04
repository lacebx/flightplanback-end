// app/models/experience.model.js
module.exports = (sequelize, Sequelize) => {
  const Experience = sequelize.define("experience", {
    experienceid: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

    category: {
            type: Sequelize.STRING,
            allowNull: false, 
        },

    type: {
        type: Sequelize.STRING,
         allowNull: false, 
    },

    name: {
            type: Sequelize.STRING,
            allowNull: false, 
    },
    
            
    description: {
            type: Sequelize.TEXT,
            allowNull: false, 
      },
    
    
    pointsearned: {
            type: Sequelize.INTEGER,
            allowNull: false, 
      },
    
    reflectionrequired: {
            type: Sequelize.TINYINT,
            allowNull: false, 
      },
    
     schedulingtype: {
            type: Sequelize.STRING,
            allowNull: false, 
        },
    
   
  });

    return Experience;
};
