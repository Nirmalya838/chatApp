const express = require('express');

const router = express.Router();
const loginControllers = require('../controllers/loginController');

router.get('/login',loginControllers.getloginPage);

router.post('/login/login-user',loginControllers.postCheckUser);

module.exports=router;