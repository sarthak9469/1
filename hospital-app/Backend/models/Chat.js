const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import the sequelize connection
const Message = require('./Message');
const db = require('../config/db');

const Chat = db.define('Chat', {
    consultationId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false, 
    },
    doctorId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    patientId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });

module.exports = Chat;
