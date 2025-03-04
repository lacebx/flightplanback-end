// app/models/event.model.js
import Sequelize from 'sequelize';
import {db} from '../config/db.config.js';
import {Flightplan} from './flightplan.model.js';

export const Event = db.define('Event',{
    eventid: {
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

    


    name: {
        type: Sequelize.STRING(100),
    },

    description: {
        type: Sequelize.TEXT,
    },
 
    eventtype: {
        type: Sequelize.STRING,
    },

    date: {
 
        type: Sequelize.DATE,
      
    },

starttime: {
        type: Sequelize.TIME,
    },

    endtime: {
        type: Sequelize.TIME,
    },

    location: {
        type: Sequelize.INTEGER,

    },

    attendancetype: {
        type: Sequelize.STRING,
    },


});

Event.belongsTo(Flightplan);

// Sync the table (remove this before deploying in production)
Event.sync({ alter: true })
    .then(() => {
        console.log('Event table synchronized');
    })
    .catch(err => {
        console.error('Error syncing the Event table:', err);
    });
    