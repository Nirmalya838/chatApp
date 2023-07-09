const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")))

const sequelize = require('./util/database');
const signupRouter = require('./routes/signupRoute');

app.use(signupRouter);

sequelize.sync()
.then(result=>{
    app.listen(process.env.PORT||3000, ()=> console.log('connected to Database'));
})
.catch(err=>{
    console.log(err);
})

