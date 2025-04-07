// app/models/badge.model.js
import Sequelize from 'sequelize';
import { db } from '../config/db.config.js';

export const Badge = db.define('badge', {
    badgeid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'userID',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.STRING,
    },
    points: {
        type: Sequelize.INTEGER,
    },
});
Badge.sync({ alter: true })
    .then(() => {
        console.log('badge table synchronized');
    })
    .catch(err => {
        console.error('Error syncing the badge table:', err);
    });
