// app/models/cliftonstrengths.model.js
module.exports = (sequelize, Sequelize) => {
  const Cliftonstrengths = sequelize.define("cliftonstrengths", {
    strengthid: {
      type: Sequelize.INTEGER(11),
       primaryKey: true,
      autoIncrement: true,
    },

    name: {
            type: Sequelize.STRING(100),
        },
   
  });

    return Cliftonstrengths;
};
