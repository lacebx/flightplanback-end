// app/models/experience.model.js
import Sequelize from 'sequelize';
import {db} from '../config/db.config.js';


export const Experience = db.define('experience',{

  experienceid: {
    type: Sequelize.INTEGER,
     primaryKey: true,
    autoIncrement: true,
  },

  user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'users',
              key: "userID", // Matches the primary key in User
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
      },

  category: {
          type: Sequelize.STRING,
          allowNull: false, 
      },

  type: {
      type: Sequelize.STRING,
       allowNull: false, 
  },

  name: {
          type: Sequelize.STRING,
          allowNull: false, 
  },
  
          
  description: {
          type: Sequelize.TEXT,
          allowNull: false, 
    },
  
  
  pointsearned: {
          type: Sequelize.INTEGER,
          allowNull: false, 
    },
  
  reflectionrequired: {
          type: Sequelize.TINYINT,
          allowNull: false, 
    },
  
   schedulingtype: {
          type: Sequelize.STRING,
          allowNull: false, 
      },

});

Experience.sync({ alter: true })
    .then(() => {
        console.log('experience table synchronized');
    })
    .catch(err => {
        console.error('Error syncing the experience table:', err);
});

// module.exports = (sequelize, Sequelize) => {
//   const Experience = sequelize.define("experience", {
//     experienceid: {
//       type: Sequelize.INTEGER,
//        primaryKey: true,
//       autoIncrement: true,
//     },

//     category: {
//             type: Sequelize.STRING,
//             allowNull: false, 
//         },

//     type: {
//         type: Sequelize.STRING,
//          allowNull: false, 
//     },

//     name: {
//             type: Sequelize.STRING,
//             allowNull: false, 
//     },
    
            
//     description: {
//             type: Sequelize.TEXT,
//             allowNull: false, 
//       },
    
    
//     pointsearned: {
//             type: Sequelize.INTEGER,
//             allowNull: false, 
//       },
    
//     reflectionrequired: {
//             type: Sequelize.TINYINT,
//             allowNull: false, 
//       },
    
//      schedulingtype: {
//             type: Sequelize.STRING,
//             allowNull: false, 
//         },
    
   
//   });

//     return Experience;
// };
