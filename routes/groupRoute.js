const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth');
const groupController = require('../controllers/groupController');

router.post('/createGroup', authentication.authenticated, groupController.createGroup);

router.get('/group-names', groupController.getGroupNames);

router.get('/group-chat/:id', groupController.groupChatPage);

router.get('/groupusers', groupController.groupUsers);

router.get('/groups/:groupId/members',groupController.getGroupMembers);

router.delete('/groups/:Group_Id/delete/:userId', groupController.deleteUser);

router.put('/groups/:Group_Id/makeAdmin/:userId', groupController.makeaAdmin);

router.post('/groups/:Group_Id/addUser',groupController.addNewUser);


module.exports=router;
