// app/models/task_major.model.js
module.exports = (sequelize, Sequelize) => {
    const Task_major = sequelize.define("task_major", {
        taskid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        majorid: {
            type: Sequelize.INTEGER,
        },
    
    
        
        
        });
                
                
    return Task_major;
};
