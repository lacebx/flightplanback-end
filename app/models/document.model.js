// app/models/document.model.js
import Sequelize from 'sequelize';
import {db} from '../config/db.config.js';
import {User} from './user.model.js';

export const Document = db.define('document',{
         documentid: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                    autoIncrement: true,
                },
        
                user_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        references: {
                            model: User,
                            key: "userID", // Matches the primary key in User
                        },
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
            
            
                documenttype: {
                    type: Sequelize.STRING,
                },
            
                filepath: {
                    type: Sequelize.STRING(255),
                },
             

});
Document.belongsTo(User);

Document.sync({ alter: true })
    .then(() => {
        console.log('document table synchronized');
    })
    .catch(err => {
        console.error('Error syncing the document table:', err);
});

// module.exports = (sequelize, Sequelize) => {
//     const Document = sequelize.define("document", {
//         documentid: {
//             type: Sequelize.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },

//         studentid: {
//             type: Sequelize.INTEGER,
//         },
    
    
//         documenttype: {
//             type: Sequelize.STRING,
//         },
    
//         filepath: {
//             type: Sequelize.STRING(255),
//         },
     
        
//         });
                
                
//     return Document;
// };
