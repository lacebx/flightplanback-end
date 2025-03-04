// app/models/task.model.js
import Sequelize from 'sequelize';
import { db } from '../config/db.config.js';
import {Flightplan} from './flightplan.model.js';

export const Task  = db.define('task',{
    Taskid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    flightplan_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Flightplan,
                key: "flightplanID", // Matches the primary key in User
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
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

    }

},
{
    timestamp: false,
});

Task.belongsTo(Flightplan);

// Sync the table (remove this before deploying in production)
Task.sync({ alter: true })
    .then(() => {
        console.log('Task table synchronized');
    })
    .catch(err => {
        console.error('Error syncing the Task table:', err);
    });