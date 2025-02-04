// app/models/experience_major.model.js
module.exports = (sequelize, Sequelize) => {
  const Experience_major = sequelize.define("experience_major", {
    experienceid: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

    majorid: {
            type: Sequelize.INTEGER,
        },
   
  });

    return Experience_major;
};
