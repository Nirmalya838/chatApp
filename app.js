const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const fileupload=require('express-fileupload');
app.use(fileupload());


app.use(express.json());
app.use(express.static(path.join(__dirname,"public")))

app.use(cors({origin: '*'}));

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

//SOCKET
io.on('connection', socket => {
    console.log('SOCKET CONNECTED', socket.id)

    socket.on('join-room', (grpid, username, cb) => {
        socket.join(grpid);
        cb();
    })

    socket.on('send-message', (gid, usermsg, username) => {
         if (gid == null) {
             socket.broadcast.emit('receive-message', usermsg, username);
             console.log(usermsg,username);
         } else {
            socket.to(gid).emit('receive-message', usermsg, username);
            console.log(socket.id, usermsg);
        }
    })

    socket.on('close', () => {
        console.log('Client disconnected');
      });
})

sequelize.sync()
.then(result=>{
    server.listen(process.env.PORT||3000, ()=> console.log('connected to Database'));
})
.catch(err=>{
    console.log(err);
})

