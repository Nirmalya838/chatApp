const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth');
const chatController = require('../controllers/chatController');


router.get('/chat/',chatController.getHomePage);

router.post('/add-chat', authentication.authenticated, chatController.addChat);

router.get('/get-chat', chatController.getAllMesssages);

router.get('/all-users', chatController.getAllUsers);

router.get('/participatedGroups', chatController.getGroupData);

module.exports=router;
