const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth');
const groupController = require('../controllers/groupController');

router.post('/createGroup', authentication.authenticated, groupController.createGroup);

module.exports=router;
