const Sequelize = require('sequelize');

const sequelize = new Sequelize('chatApp', 'root', 'Javascript@321',{
    dialect:'mysql',
    host: 'localhost',
})

module.exports = sequelize;