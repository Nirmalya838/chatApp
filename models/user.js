const Sequelize = require('sequelize');
const Group = require('./group');
const sequelize = require('../util/database');

const User =  sequelize.define('user',{
    id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    phone:{
        type:Sequelize.DataTypes.BIGINT,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.DataTypes.STRING,
        allowNull:false,
    }
})

module.exports = User;