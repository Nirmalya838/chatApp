const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")))

app.use(cors({origin: 'http://127.0.0.1:3000',
methods: ['GET', 'POST']}));

const sequelize = require('./util/database');
const signupRouter = require('./routes/signupRoute');
const loginRouter = require('./routes/loginRoute');

app.use(signupRouter);
app.use(loginRouter);

sequelize.sync()
.then(result=>{
    app.listen(process.env.PORT||3000, ()=> console.log('connected to Database'));
})
.catch(err=>{
    console.log(err);
})

