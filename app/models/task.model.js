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
     
        description: {
            type: Sequelize.TEXT,
        },
   
        pointsearned: {
     
            type: Sequelize.INTEGER(11),
          
        },

        reflectionrequired: {
            type: Sequelize.TINYINT,
        },

        schedulingtype: {
            type: Sequelize.STRING,
        },
    
        completiontype: {
            type: Sequelize.STRING,

        },
    
        semester: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 8,
            },
        },
    });
                
                
    return Task;
};
