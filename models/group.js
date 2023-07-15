const Sequelize = require('sequelize');
const User = require('./user');
const sequelize = require('../util/database');

const Group = sequelize.define('Group', {
  group_id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  group_name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  created_by: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Group;
