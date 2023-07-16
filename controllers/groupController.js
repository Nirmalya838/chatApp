const User = require('../models/user');
const Group = require('../models/group');
const path = require('path');

exports.createGroup = async (req, res, next) => {
    try {
      const { group_name, participants, created_by } = req.body;
  
      // Create a new group in the database
      const group = await Group.create({ group_name: group_name, created_by: created_by });
  
      // Associate the participants with the group
      const UserObjects = await User.findAll({
        where: {
          name: participants
        }
      });
      await group.addUsers(UserObjects);
  
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

  
  