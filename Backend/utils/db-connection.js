const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('project', 'root', 'Ajay@2529', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
