// app/models/event.model.js
module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define("event", {
        eventid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        experienceid: {
            type: Sequelize.INTEGER,
        },
    
    
        name: {
            type: Sequelize.STRING(100),
        },
    
        description: {
            type: Sequelize.TEXT,
        },
     
        eventtype: {
            type: Sequelize.STRING,
        },
   
        date: {
     
            type: Sequelize.DATE,
          
        },

    starttime: {
            type: Sequelize.TIME,
        },

        endtime: {
            type: Sequelize.TIME,
        },
    
        location: {
            type: Sequelize.INTEGER,

        },
    
        attendancetype: {
            type: Sequelize.STRING,
        },

        });
                
                
    return Event;
};
