// app/models/experience_cliftonstrengths.model.js
module.exports = (sequelize, Sequelize) => {
  const Experience_cliftonstrengths = sequelize.define("experience_cliftonstrengths", {
    experienceid: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

    strengthid: {
            type: Sequelize.INTEGER,
            allowNull: false, 
        },
   
  });

    return Experience_cliftonstrengths;
};
