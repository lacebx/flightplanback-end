// app/models/badge.model.js
module.exports = (sequelize, Sequelize) => {
  const Badge = sequelize.define("Badge", {
    badgeid: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

    name: {
            type: Sequelize.STRING,
            allowNull: false,
      },
    
    
    description: {
            type: Sequelize.STRING,
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
