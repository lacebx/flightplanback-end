// app/models/award.model.js
module.exports = (sequelize, Sequelize) => {
    const Award = sequelize.define("award", {
        awardid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: Sequelize.STRING(100),
        },
    
    
        description: {
            type: Sequelize.TEXT,
        },
    
        points: {
            type: Sequelize.INTEGER,
        },
     
        redemptiontype: {
            type: Sequelize.STRING,
        },
   
        redemptioninfo: {
     
            type: Sequelize.TEXT,
          
        },

    
        });
                
                
    return Award;
};
