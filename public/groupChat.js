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


document.addEventListener('DOMContentLoaded', async () => {
  
  
  function showMembers() {
    const groupMembers = sessionStorage.getItem('groupMembers');
    const admin = localStorage.getItem('Admin');
    const group_id = sessionStorage.getItem('Group_Id');
    const token = sessionStorage.getItem('token');
    const loggedInUserId = parseJwt(token).userId;
  
    const members = JSON.parse(groupMembers);
    const Admin = JSON.parse(admin);
    const Group_Id = JSON.parse(group_id);
  
    const memberList = document.getElementById('groupuserlist');
    members.forEach(member => {
      const listItem = document.createElement('li');
      listItem.textContent = member.name;
      if (member.id === Admin) {
        listItem.textContent += ' (Admin)';
        listItem.style.fontWeight = 'bold';
      }
  
      const button = document.createElement('button');
      const makeAdmin = document.createElement('button');
      button.textContent = 'Delete User';
      button.id = `deleteButton_${member.id}`;
      makeAdmin.textContent = 'Make ADMIN';
      makeAdmin.id = `deleteButton_${member.id}`;
  
      button.addEventListener('click', () => { handleDeleteUser(member.id, Group_Id); });
      makeAdmin.addEventListener('click', () => { handleMakeAdmin(member.id, Group_Id); });
  
      listItem.appendChild(button);
      listItem.appendChild(makeAdmin);
      memberList.appendChild(listItem);
    });
  
    if (loggedInUserId === Admin) {
      const inviteButton = document.createElement('button');
      inviteButton.textContent = 'Invite User';
      inviteButton.id = 'inviteButton';
      inviteButton.addEventListener('click', () => { handleInviteUser(Group_Id); });
  
      memberList.appendChild(inviteButton);
    }
  }
  
  showMembers();
  async function handleInviteUser(Group_Id) {
    try {
      // Fetch all users from the server
      const response = await axios.get('/all-users');
      const allUsers = response.data;
      console.log(allUsers)
      // Fetch the current members of the group from the server
      const membersResponse = await axios.get(`/groups/${Group_Id}/members`);
      const groupMembers = membersResponse.data.members;
      console.log(groupMembers)
      // Filter out the users who are already members of the group
      const nonGroupMembers = allUsers.filter(user => !groupMembers.some(members=> members.id === user.id));
      console.log(nonGroupMembers)
      console.log("hi")
  
      // Create a popup or dropdown menu to display the list of non-group members
      const invitePopup = document.createElement('div');
      invitePopup.style.backgroundColor = 'white';
      invitePopup.style.padding = '10px';
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
        invitePopup.remove(); // Close the popup after adding the user
      });

      userItem.appendChild(addButton);
      invitePopup.appendChild(userItem);
    });

    // Add the popup or dropdown menu to the document body
    document.body.appendChild(invitePopup);
    } catch (error) {
      console.error('Error fetching users or group members:', error);
    }
  }
  

  async function handleAddUser(userId) {
    try {
      
      const url = new URL(window.location.href);
      const pathname = url.pathname;
      const Group_Id = decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1).split('+')[0]);
      const response = await axios.post(`/groups/${Group_Id}/addUser`, {userId, Group_Id});
      const groupMembers = sessionStorage.getItem('groupMembers');
      const members = JSON.parse(groupMembers);
      members.push(response.data);
      const newmembers = JSON.stringify(members); 
      sessionStorage.setItem('groupMembers', newmembers);
      location.reload();
      
    } catch (error) {
      console.error('Error adding user to the group:', error);
      
    }
  }
  
  async function handleDeleteUser(userId, Group_Id) {
    const token = sessionStorage.getItem('token');
    const loggedInUserId = parseJwt(token).userId;
    const adminId = parseInt(localStorage.getItem('Admin'), 10);
  
    if (loggedInUserId === adminId) {
      try {
        const response = await axios.delete(`/groups/${Group_Id}/delete/${userId}`);
        console.log(response.data.message);
        console.log(`User with ID ${userId} deleted`);
  
        // Remove the user from session storage
        const groupMembers = JSON.parse(sessionStorage.getItem('groupMembers'));
        const updatedMembers = groupMembers.filter(member => member.id !== userId);
        sessionStorage.setItem('groupMembers', JSON.stringify(updatedMembers));
  
        const deleteButton = document.getElementById(`deleteButton_${userId}`);
        const listItem = deleteButton.parentNode;
        listItem.parentNode.removeChild(listItem);
      } catch (error) {
        console.error(error.response.data.message);
      }
    } else {
      console.log('You are not an admin');
      alert('You are not an admin');
    }
  }
  

  async function handleMakeAdmin(userId, Group_Id) {
    const token = sessioSntorage.getItem('token');
    const loggedInUserId = parseJwt(token).userId;
  
    const adminId = parseInt(localStorage.getItem('Admin'), 10);
  
    if (loggedInUserId == adminId) {
      try {
        // Update the user's role to admin in the backend
        const response = await axios.put(`/groups/${Group_Id}/makeAdmin/${userId}`);
        console.log(response.data.message);
        let Admin = JSON.parse(localStorage.getItem('Admin'));
        let newAdmin = [Admin];
        newAdmin.push(userId);
        console.log(newAdmin);
        localStorage.setItem('Admin', JSON.stringify(newAdmin));
        
      } catch (error) {
        console.error(error.response.data.message);
      }
    } else {
      console.log('You are not an admin');
      alert('You are not an admin');
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




