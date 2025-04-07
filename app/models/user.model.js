import Sequelize from 'sequelize';
import {db} from '../config/db.config.js';

export const User = db.define('user',{
    userID: {
        type: Sequelize.INTEGER,
         primaryKey: true,
        autoIncrement: true,
      },
  
      name: {
              type: Sequelize.STRING,
              allowNull: false, 
          },
  
      email: {
          type: Sequelize.STRING,
           allowNull: false, 
      },
  
      graduationdate: {
              type: Sequelize.DATE,
              allowNull: true, 
              validate: {
                isRequiredForStudent(value) {
                  if (this.role === "student" && !value) {
                    throw new Error("Major is required for students.");
                  }
                },
              },
      },
      
              
      major: {
              type: Sequelize.STRING,
              allowNull: true, 
              validate: {
                isRequiredForStudent(value) {
                  if (this.role === "student" && !value) {
                    throw new Error("Major is required for students.");
                  }
                },
              },
        },
      
      
      
      pointsawarded: {
              type: Sequelize.INTEGER,
              allowNull: true, 
              validate: {
                isRequiredForStudent(value) {
                  if (this.role === "student" && !value) {
                    throw new Error("Major is required for students.");
                  }
                },
              },
        },
      
      pointsused: {
              type: Sequelize.INTEGER,
              allowNull: true, 
              validate: {
                isRequiredForStudent(value) {
                  if (this.role === "student" && !value) {
                    throw new Error("Major is required for students.");
                  }
                },
              },
        },
      
       pointavailable: {
              type: Sequelize.INTEGER,
              allowNull: true,
              validate: {
                isRequiredForStudent(value) {
                  if (this.role === "student" && !value) {
                    throw new Error("Major is required for students.");
                  }
                },
              }, 
          },
      
        badgesreceived: {
              type: Sequelize.STRING,
              allowNull: true,
              validate: {
                isRequiredForStudent(value) {
                  if (this.role === "student" && !value) {
                    throw new Error("Major is required for students.");
                  }
                },
              }, 
          },
          role:{
            type:Sequelize.ENUM('admin','student'),
            allowNull: false,
            defaultValue: 'student',
          }
  

});

User.sync({ alter: true })
    .then(() => {
        console.log('user table synchronized');
    })
    .catch(err => {
        console.error('Error syncing the user table:', err);
    });
