function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}


async function showMembers() {

  const groupId = JSON.parse(sessionStorage.getItem('Group_Id'));
  const token = sessionStorage.getItem('token');
  const loggedInUserId = parseJwt(token).userId;
  try {
    const response = await axios.get(`/groups/${groupId}/members`);
    const data = await response.data;
    const members = data.members;
    const group_id = data.group_id;
    const adminUserIds = members.filter(member => member.isAdmin).map(member => member.id);

    const memberList = document.getElementById('groupuserlist');
    memberList.innerHTML='';
    members.forEach(member => {
      const listItem = document.createElement('li');
      listItem.textContent = member.name;

      for (let i = 0; i < adminUserIds.length; i++) {
        if (member.id == adminUserIds[i]) {
          listItem.textContent += ' (Admin)';
          listItem.style.fontWeight = 'bold';
        }
      }

      const button = document.createElement('button');
      const makeAdmin = document.createElement('button');
      button.textContent = 'Delete User';
      button.id = `deleteButton_${member.id}`;
      makeAdmin.textContent = 'Make ADMIN';
      makeAdmin.id = `makeAdminButton_${member.id}`;

      button.addEventListener('click', () => { handleDeleteUser(member.id, groupId); });
      makeAdmin.addEventListener('click', () => { handleMakeAdmin(member.id, groupId); });

      listItem.appendChild(button);
      listItem.appendChild(makeAdmin);
      memberList.appendChild(listItem);
    });

    for (let i = 0; i < adminUserIds.length; i++) {
      if (loggedInUserId == adminUserIds[i]) {
        const inviteButton = document.createElement('button');
        inviteButton.textContent = 'Invite User';
        inviteButton.id = 'inviteButton';
        inviteButton.addEventListener('click', () => { handleInviteUser(groupId); });
        memberList.appendChild(inviteButton);
      }
    }
  } catch (error) {
    console.error('Error retrieving group members:', error);
  }
}



async function handleMakeAdmin(userId, Group_Id) {
  const token = sessionStorage.getItem('token');
  const loggedInUserId = parseJwt(token).userId;
  const groupId = JSON.parse(sessionStorage.getItem('Group_Id'));

  try {
    const response = await axios.get(`/groups/${groupId}/members`);
    const data = response.data;
    const members = data.members;
    const adminUserIds = members.filter(member => member.isAdmin).map(member => member.id);

    let isAdmin = false; 

    for (let i = 0; i < adminUserIds.length; i++) {
      if (loggedInUserId == adminUserIds[i]) {
        isAdmin = true;
        try {
          const response = await axios.put(`/groups/${Group_Id}/makeAdmin/${userId}`);
          console.log(response.data.message);
        } catch (error) {
          console.error(error.response.data.message);
        }
        break; 
      }
    }

    if (!isAdmin) {
      console.log('You are not an admin');
      alert('You are not an admin');
      return; 
    }

    document.getElementById('groupuserlist').textContent = '';
    await showMembers();
  } catch (err) {
    console.error("Error retrieving group members:", err);
  }
}



async function handleDeleteUser(userId, Group_Id) {
  const token = sessionStorage.getItem('token');
  const loggedInUserId = parseJwt(token).userId;
  const groupId = JSON.parse(sessionStorage.getItem('Group_Id'));

  try {
    const response = await axios.get(`/groups/${groupId}/members`);
    const data = response.data;
    const members = data.members;
    const adminUserIds = members.filter(member => member.isAdmin).map(member => member.id);

    let isAdmin = false;

    for (let i = 0; i < adminUserIds.length; i++) {
      if (loggedInUserId == adminUserIds[i]) {
        isAdmin = true;
        try {
          const response = await axios.delete(`/groups/${Group_Id}/delete/${userId}`);
          console.log(`User with ID ${userId} deleted`);
          const deleteButton = document.getElementById(`deleteButton_${userId}`);
          const listItem = deleteButton.parentNode;
          listItem.parentNode.removeChild(listItem);
        } catch (error) {
          console.error(error.response.data.message);
        }
        break; 
      }
    }

    if (!isAdmin) {
      alert('You are not an admin'); 
    }
  } catch (err) {
    console.error("Error deleting group members:", err);
  }
}


async function handleInviteUser(Group_Id) {
  try {

    const response = await axios.get('/all-users');
    const allUsers = response.data;
    // Fetch the current members of the group from the server
    const membersResponse = await axios.get(`/groups/${Group_Id}/members`);
    const groupMembers = membersResponse.data.members;
    // Filter out the users who are already members of the group
    const nonGroupMembers = allUsers.filter(user => !groupMembers.some(members=> members.id === user.id));
    console.log(nonGroupMembers)

    const invitePopup = document.createElement('div');
    invitePopup.style.backgroundColor = 'white';
    invitePopup.style.padding = '30px';
    invitePopup.style.border = '1px solid #ccc';
    invitePopup.style.position = 'absolute';
    invitePopup.style.top = '50%';
    invitePopup.style.left = '50%';
    invitePopup.style.transform = 'translate(-50%, -50%)';

    // Display the list of non-group members in the popup or dropdown menu
    nonGroupMembers.forEach(member => {
      const userItem = document.createElement('div');
      userItem.textContent = member.name;
      const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.id = `addButton_${member.id}`;
    addButton.addEventListener('click', () => {
      handleAddUser(member.id, Group_Id);
      invitePopup.remove(); 
    });

    userItem.appendChild(addButton);
    invitePopup.appendChild(userItem);
  });

  document.body.appendChild(invitePopup);
  } catch (error) {
    console.error('Error fetching users or group members:', error);
  }
}

async function handleAddUser(userId, Group_Id) {
  try {
    
    const url = new URL(window.location.href);
    const pathname = url.pathname;
    const Group_Id = JSON.parse(sessionStorage.getItem('Group_Id'));
    const response = await axios.post(`/groups/${Group_Id}/addUser`, {userId, Group_Id});
    document.getElementById('groupuserlist').textContent='';
    showMembers();
  } catch (error) {
    console.error('Error adding user to the group:', error);
    
  }
}

function outputUserJoined(username) {
  const userlist = document.getElementById('userlist');
  let user = document.createElement('li');
  user.textContent = `${username} joined.`;
  userlist.appendChild(user);
}




document.addEventListener('DOMContentLoaded', async () => {
  
  const token = sessionStorage.getItem('token');
  const loggedInUserId = parseJwt(token).userId;
  const grpid = sessionStorage.getItem('Group_Id');
  const name = parseJwt(token).username;
  
  showMembers();
  

  const url = new URL(window.location.href);
  const pathname = url.pathname;
  const groupName = decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1).split('+').pop());
  const groupId = decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1).split('+')[0]);
  document.getElementById('groupName').textContent = `Group: ${groupName}`;

  document.getElementById('add-groupchat').addEventListener('click', addGroupChat);

  async function addGroupChat(event) {
    event.preventDefault();

    const msg = document.getElementById('grpMsg').value;
    const token = sessionStorage.getItem("token");
    const user = parseJwt(token);

    const obj = {
      message: msg,
      userId: user.userId,
      username: user.username,
      groupId: parseInt(groupId, 10),
    };

    try {
      let response = await axios.post(
        "/add-chat",
        obj,
        { headers: { Authorization: token } }
      );
      document.getElementById('grpMsg').value = '';
      document.getElementById('grpMsg').focus();
    } catch (err) {
      console.log(err);
    }
  }

const uploadbtn=document.getElementById('uploadbtn');
const file=document.getElementById('file');

uploadbtn.addEventListener('click',uploadFile);

async function uploadFile(e){
 try{
     e.preventDefault();
     const uploadedfile=file.files[0];
     console.log('uploading');
     if(!uploadedfile){
        document.getElementById('uploadbtn').innerHTML="Please Upload a file ";
        setTimeout(()=>{
            msg.innerHTML="";
        },3000)
    }
    else{
     document.getElementById('uploadbtn').innerHTML="Upload";
     const formData=new FormData();
     formData.append('file',uploadedfile);
     const groupId=JSON.parse(sessionStorage.getItem('Group_Id'));
     const token=sessionStorage.getItem('token');
     const response=await axios.post(`http://localhost:3000/chat/sendgroupfile/${groupId}`,formData,{headers:{"Authorization":token,'Content-Type':'multipart/form-data'}});
     const newMessages = response.data;
     console.log(groupId);
     uploadedfile.value=null;
     document.getElementById('file').value=null;
    }
 }catch(err){
     console.log(err);
     msg.innerHTML="";
   msg.innerHTML=msg.innerHTML+`<div>${err}</div>`;
   setTimeout(()=>{
     msg.innerHTML="";
 },3000)
 }
}

      function appendGroupMessage({ message, username }) {
        const listItem = document.createElement('li');
        const messageContent = isLink(message) ? `<strong>${username}</strong> <a href="${message}" target="_blank">${message}</a>` : `<strong>${username}</strong> ${message}`;
        listItem.innerHTML = messageContent;
        document.getElementById('groupMessage-list').appendChild(listItem);
      }
      
      // Function to check if the message is a link
      function isLink(message) {
        // Regular expression to match URL patterns (https://stackoverflow.com/a/3809435)
        const urlPattern = new RegExp('^https?://.+');
        return urlPattern.test(message);
      }
      

  async function getGroupMessages() {
    try {
      const response = await axios.get('/get-chat');
      const newMessages = response.data;
      const filteredMessages = newMessages.filter(message => message.GroupGroupId == parseInt(groupId, 10));
      filteredMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const last10Messages = filteredMessages.slice(0, 10);

      return last10Messages.reverse();
    } catch (error) {
      console.error('Error retrieving group messages:', error);
      return [];
    }
  }

  async function displayGroupMessages() {
    const groupMessages = await getGroupMessages();
    document.getElementById('groupMessage-list').innerHTML = '';

    groupMessages.forEach(message => {
      appendGroupMessage(message);
    });
  }

  setInterval(async () => {
    await getGroupMessages();
     await displayGroupMessages();
  }, 2000);

      
  

  document.getElementById('leaveGroup').addEventListener('click', () => {
    window.location.href = document.referrer;
  });
  
});




