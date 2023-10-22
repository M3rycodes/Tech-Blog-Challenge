const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: '127.0.01',
  dialect: 'mysql',
});

module.exports = sequelize;
