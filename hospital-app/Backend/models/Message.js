const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Chat = require('./Chat');
const db = require('../config/db');

const Message = db.define('Message', {
    chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true,
});


module.exports = Message;
