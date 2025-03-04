// app/models/flightplan.model.js
import Sequelize from 'sequelize';
import {db} from '../config/db.config';
import {Task} from './task.model';
import {Event} from './event.model';
import {User} from './user.model.js';

export const Flightplan = db.define('flightplan',{
  flightplanID: {
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

  Semester: {   
    type: Sequelize.STRING,  
  },

  SemestersFromGraduation: {
          type: Sequelize.INTEGER,
          allowNull: false, 
  },
  
  
  Status: {
          type: Sequelize.STRING,
          allowNull: false, 
      },
 
});
Flightplan.hasMany(Task);
Flightplan.hasMany(Event);
Flightplan.belongsTo(User);

Flightplan.sync({ alter: true })
    .then(() => {
        console.log('Flightplan table synchronized');
    })
    .catch(err => {
        console.error('Error syncing the Flightplan table:', err);
    });

