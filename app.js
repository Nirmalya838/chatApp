const express = require('express');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")))

app.use(cors({origin: 'http://127.0.0.1:3000',
methods: ['GET', 'POST']}));

const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const GroupUser = require('./models/groupUser');
const sequelize = require('./util/database');
const signupRouter = require('./routes/signupRoute');
const loginRouter = require('./routes/loginRoute');
const chatRouter = require('./routes/chatRoute');
const groupRouter = require('./routes/groupRoute');

app.use(signupRouter);
app.use(loginRouter);
app.use(chatRouter);
app.use(groupRouter);

User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

Group.belongsToMany(User, { through: 'GroupUser' });
User.belongsToMany(Group, { through: 'GroupUser' });

sequelize.sync()
.then(result=>{
    app.listen(process.env.PORT||3000, ()=> console.log('connected to Database'));
})
.catch(err=>{
    console.log(err);
})

