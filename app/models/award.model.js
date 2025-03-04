// app/models/award.model.js
import Sequelize from 'sequelize';
import {db} from '../config/db.config';
import {User} from './user.model';

export const Award = db.define('award',{
    awardid: {
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
Award.belongsTo(User);


//remove before moving to server

Award.sync({ alter: true })
    .then(() => {
        console.log('award table synchronized');
    })
    .catch(err => {
        console.error('Error syncing the award table:', err);
    });



