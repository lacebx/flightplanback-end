// app/models/major.model.js
module.exports = (sequelize, Sequelize) => {
  const Major = sequelize.define("major", {
    majorid: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

    name: {
            type: Sequelize.STRING,
        },
   
  });

    return Major;
};
