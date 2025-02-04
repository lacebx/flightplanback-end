// app/models/badge.model.js
module.exports = (sequelize, Sequelize) => {
  const Badge = sequelize.define("badge", {
    badgeid: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

    name: {
            type: Sequelize.STRING,
      },
    
    
    description: {
            type: Sequelize.TEXT,
      },
    
     type: {
            type: Sequelize.STRING,
      },
     
      points: {
            type: Sequelize.INTEGER,
        },
   
  });

    return Badge;
};
