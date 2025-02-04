// app/models/admin.model.js
module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define("admin", {
    adminid: {
      type: Sequelize.INTEGER,
       primaryKey: true,
      autoIncrement: true,
    },

    name: {
            type: Sequelize.STRING,
      },
    
     email: {
            type: Sequelize.STRING,
        },
   
  });

    return Admin;
};
