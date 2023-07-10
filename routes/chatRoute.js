const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth');
const chatController = require('../controllers/chatController');


router.get('/chat/',chatController.getHomePage);

module.exports=router;
