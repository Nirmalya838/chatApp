const path = require("path");
const sequelize = require("../util/database");
const { json } = require("sequelize");
const User = require("../models/user");
const Message = require('../models/message');

exports.getHomePage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views/chat.html"));
};

exports.addChat = async (req, res, next) => {
  const msg = req.body.message;

  const t = await sequelize.transaction();
  try {
    const result = await Message.create(
      {
        message: msg,
        userId: req.user.id,
        username: req.user.name
      },

      { transaction: t }
    );
    await t.commit();
    res.status(201).json({ newMessage: result });
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};

exports.getAllMesssages = async (req, res, next) => {
  try {
    const messages = await Message.findAll();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
