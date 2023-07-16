const User = require('../models/user');
const Group = require('../models/group');
const GroupUser = require('../models/groupUser');
const path = require('path');

exports.createGroup = async (req, res, next) => {
  try {
    const { group_name, participants, created_by } = req.body;

    const group = await Group.create({ group_name: group_name, created_by: created_by });

    const user = await User.findOne({
      where: {
        name: created_by
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await group.setAdmin(user);

    const userObjects = await User.findAll({
      where: {
        name: participants
      }
    });
    await group.addUsers(userObjects);

    console.log('Group created:', group);
    res.json({ success: true, group });
  } catch (error) {
    console.error('Error creating group:', error);
    res.json({ success: false, error });
  }
};


  exports.getGroupNames = async (req, res, next) => {
    try {
      const groupName = await Group.findAll();
  
      if (!groupName || groupName.length === 0) {
        return res.status(404).json({ error: 'No group data found' });
      }
  
      res.json({ groupName });
    } catch (error) {
      console.error('Error occurred while retrieving group data:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };

  exports.groupChatPage = async (req, res, next) => {
    const groupId = req.params.groupId;
    
    res.sendFile(path.join(__dirname, '../views/groupChat.html'));
  };

  exports.groupUsers = async (req, res, next) => {
    try {
      const users = await GroupUser.findAll();
      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  exports.getGroupDetails = async (req, res, next) => {
    try {
      const users = await Group.findAll();
      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  