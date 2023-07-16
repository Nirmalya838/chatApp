const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth');
const groupController = require('../controllers/groupController');

router.post('/createGroup', authentication.authenticated, groupController.createGroup);

router.get('/group-names', groupController.getGroupNames);

router.get('/group-chat/:id', groupController.groupChatPage);

module.exports=router;
