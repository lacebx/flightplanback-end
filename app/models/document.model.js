// app/models/document.model.js
module.exports = (sequelize, Sequelize) => {
    const Document = sequelize.define("document", {
        documentid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        studentid: {
            type: Sequelize.INTEGER,
        },
    
    
        documenttype: {
            type: Sequelize.STRING,
        },
    
        filepath: {
            type: Sequelize.STRING(255),
        },
     
        
        });
                
                
    return Document;
};
