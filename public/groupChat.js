document.addEventListener('DOMContentLoaded', async () => {
  
  
  function showMembers(){
    const groupMembers = sessionStorage.getItem('groupMembers');
    const admin = sessionStorage.getItem('Admin');
    const group_id = sessionStorage.getItem('Group_Id');
    
    const members = JSON.parse(groupMembers);
    const Admin = JSON.parse(admin);
    const  Group_Id= JSON.parse(group_id);
    
    
 
    const memberList = document.getElementById('groupuserlist');
    members.forEach(member => {
      const listItem = document.createElement('li');
      listItem.textContent = member.name;
      const button = document.createElement('button');
      button.textContent = 'Delete User';
      button.id =`deleteButton_${member.id}`;

      if (member.id === Admin ) {
        listItem.textContent += ' (Admin)';
        listItem.style.fontWeight = 'bold';
      }
      
      button.addEventListener('click', () => { handleDeleteUser(member.id,Group_Id);});
      

      listItem.appendChild(button);
      memberList.appendChild(listItem);
    });
  }
  showMembers();
  
  async function handleDeleteUser(userId,Group_Id) {
    const token = sessionStorage.getItem('token');
    const loggedInUserId = parseJwt(token).userId;
    //const admin = sessionStorage.getItem('Admin')
    console.log(loggedInUserId);

  const adminId = parseInt(sessionStorage.getItem('Admin'), 10);
  console.log(adminId)
    
 if (loggedInUserId === adminId) {
  
    try {
      const response = await axios.delete(`/groups/${Group_Id}/delete/${userId}`);

    console.log(response.data.message);
    console.log(`User with ID ${userId} deleted`);
    const deleteButton = document.getElementById(`deleteButton_${userId}`);
    const listItem = deleteButton.parentNode;
    listItem.parentNode.removeChild(listItem);
  } catch (error) {
    console.error(error.response.data.message);
  }
    
  }
   else{
    console.log('you are not admin')
   }
  }

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

  async function getGroupMessages() {
    try {
      const response = await axios.get('/get-chat');
      const newMessages = response.data;
      const filteredMessages = newMessages.filter(message => message.GroupGroupId === parseInt(groupId, 10));
      return filteredMessages;
    } catch (error) {
      console.error('Error retrieving group messages:', error);
      return [];
    }
  }

  function appendGroupMessage({ message, username }) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${username}</strong> ${message}`;
    document.getElementById('groupMessage-list').appendChild(listItem);
  }

  async function displayGroupMessages() {
    const groupMessages = await getGroupMessages();
    document.getElementById('groupMessage-list').innerHTML = '';

    groupMessages.forEach(message => {
      appendGroupMessage(message);
    });
  }

  // Refresh the displayed messages periodically
  setInterval(async () => {
    await getGroupMessages();
    await displayGroupMessages();
  }, 1000);

  document.getElementById('leaveGroup').addEventListener('click', () => {
    window.location.href = document.referrer;
  });
  
});
