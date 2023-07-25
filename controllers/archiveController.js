const path = require("path");
const sequelize = require("../util/database");
const { json } = require("sequelize");
const User = require("../models/user");
const Message = require('../models/message');
const Group = require('../models/group');
const GroupUser = require('../models/groupUser');
const ArchivedChat = require('../models/archive');

exports.moveMessagesToArchivedChat = async function (req,res,next) {
    try {
      // Calculate the date one day ago from today
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
      // Find all messages older than one day
      const messagesToMove = await Message.findAll({
        where: {
          createdAt: { [sequelize.Op.lt]: oneDayAgo },
        },
      });
  
      // Move messages to archived_chat table
      for (const message of messagesToMove) {
        await ArchivedChat.create({
          message: message.message,
          username: message.username,
          userId: message.userId,
          GroupGroupId: message.GroupGroupId,
        });
      }
  
      // Delete the moved messages from the message table
      await Message.destroy({
        where: {
          createdAt: { [sequelize.Op.lt]: oneDayAgo },
        },
      });
  
      console.log('Messages moved to archived_chat successfully!');
    } catch (error) {
      console.error('Error moving messages:', error);
    }
  }