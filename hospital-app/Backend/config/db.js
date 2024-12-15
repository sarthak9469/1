const { Sequelize } = require('sequelize');

const db = new Sequelize('skin', 'root', 'sarTHak@9469', {
    host: 'localhost',
    dialect: 'mysql',
});

const testConnection = async () => {
    try {
        await db.authenticate();
        console.log('The connection has been established successfully...');
    } catch (error) {
        console.error('The connection has not been established:', error);
    }
};

testConnection();

module.exports = db;