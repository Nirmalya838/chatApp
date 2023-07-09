const User = require('../models/user');
const path = require('path');
const  bcrypt =  require('bcrypt');

exports.getHomePage = (req, res, next) => {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
};

exports.postAddUser = async(req,res,next)=>{
    const name = req.body.name;
    const email=req.body.email;
    const phone=req.body.phone;
    const password = req.body.password;

    try{
        let existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({msg:'Email already exists'});
    }
        const saltRounds=10;
        bcrypt.hash(password,saltRounds,async(err,hash)=>{
            const result = await User.create({name:name,email:email,phone:phone,password:hash});
            res.status(201).json({newSignUp:result});
        })
    }
    catch(err){
        console.log(err);
    }
}




