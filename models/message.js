const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Message =  sequelize.define('message',{
    id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    message:{
        type:Sequelize.DataTypes.STRING,
        allowNull:false,
    },
    username: {
        type:Sequelize.DataTypes.STRING,
        allowNull:false
    }
})

module.exports = Message;