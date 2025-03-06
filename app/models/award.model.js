// app/models/award.model.js
import Sequelize from 'sequelize';
import { db } from '../config/db.config.js';

export const Award = db.define('award', {
    awardid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',  // Use the model name as a string
            key: 'userID',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    name: {
        type: Sequelize.STRING(100),
    },
    description: {
        type: Sequelize.TEXT,
    },
    points: {
        type: Sequelize.INTEGER,
    },
    redemptiontype: {
        type: Sequelize.STRING,
    },
    redemptioninfo: {
        type: Sequelize.TEXT,
    },
});

// Define associations in the index file


//remove before deployment

Award.sync({ alter: true })
    .then(() => {
        console.log('award table synchronized');
    })
    .catch(err => {
        console.error('Error syncing the award table:', err);
    });



