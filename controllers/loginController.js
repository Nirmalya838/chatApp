const User = require('../models/user');
const path = require('path');
const  bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getloginPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../views/login.html'));
}


function generateAccessToken(id,email,name){
   return jwt.sign({userId:id,email:email,username:name},'secretKey');
}


exports.postCheckUser = async(req,res,next)=>{
    const email=req.body.email;
    const password = req.body.password;

    try{
        const user = await User.findAll({where:{email:email}});
        if(user.length>0){
            bcrypt.compare(password,user[0].password,async(err,result)=>{
                if(err){
                    res.status(400).json({message:"Something is wrong"});
                }

                if(result==true){
                    res.status(200).json({message:"successfully login",token:generateAccessToken(user[0].id,user[0].email,user[0].name)});
                }
                else{
                    return res.status(401).json({message:"password is wrong, user is not authorized!"});
                }
            })
        }
        else{
            return res.status(404).json({message:"user does not exist!"})
        }
    }
    catch(err){
        console.log(err);
    }
}

