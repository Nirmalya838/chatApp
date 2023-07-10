const path = require("path");
const sequelize = require("../util/database");
const { json } = require("sequelize");
const User = require("../models/user");

exports.getHomePage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views/chat.html"));
};
