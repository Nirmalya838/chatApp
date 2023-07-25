const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth');
const chatController = require('../controllers/chatController');
const archiveController = require('../controllers/archiveController');


router.get('/chat/',chatController.getHomePage);

router.post('/add-chat', authentication.authenticated, chatController.addChat);

router.get('/get-chat', chatController.getAllMesssages);

router.get('/all-users', chatController.getAllUsers);

router.get('/participatedGroups', chatController.getGroupData);

router.post('/chat/sendfile/:groupId',authentication.authenticated, chatController.uploadFile);

router.post('/chat/sendgroupfile/:groupId',authentication.authenticated, chatController.uploadGroupFile);

router.post('/move-messages', archiveController.moveMessagesToArchivedChat);

module.exports=router;
