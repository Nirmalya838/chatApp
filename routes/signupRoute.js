const express = require('express');

const router = express.Router();
const signupControllers = require('../controllers/signupController');

router.get('/',signupControllers.getHomePage);

router.post('/signup',signupControllers.postAddUser);

module.exports=router;