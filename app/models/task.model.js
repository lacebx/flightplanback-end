// app/models/task.model.js
module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define("task", {
        Taskid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        category: {
            type: Sequelize.STRING,
        },
    
    
        type: {
            type: Sequelize.STRING,
        },
    
        name: {
            type: Sequelize.STRING(100),
        },
     
        descripion: {
            type: Sequelize.TEXT,
        },
   
        pointesearned: {
     
            type: Sequelize.INTEGER(11),
          
        },

        reflectionrequired: {
            type: Sequelize.TINYINT,
        },

        shedulingtype: {
            type: Sequelize.STRING,
        },
    
        completiontype: {
            type: Sequelize.STRING,

        },
    
        });
                
                
    return Task;
};
