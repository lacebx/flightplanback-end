import Sequelize from 'sequelize';
import {db} from '../config/db.config.js';
import {Award} from './award.model.js';
import {Experience} from './experience.model.js';
import {Document} from './document.model.js';
import {Badge} from './badge.model.js';
import {Flightplan} from './flightplan.model.js';

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
            type:DataTypes.ENUM('admin','student'),
            allowNull: false,
            defaultValue: 'student',
          }
  

});
User.hasMany(Document);
User.hasMany(Badge);
User.hasMany(Experience);
User.hasMany(Award);
User.hasOne(Flightplan);

User.sync({ alter: true })
    .then(() => {
        console.log('user table synchronized');
    })
    .catch(err => {
        console.error('Error syncing the user table:', err);
    });
