document.addEventListener('DOMContentLoaded', async () => {
  
  
  function showMembers(){
    const groupMembers = sessionStorage.getItem('groupMembers');
    const members = JSON.parse(groupMembers);
    const memberList = document.getElementById('groupuserlist');
    members.forEach(member => {
      const listItem = document.createElement('li');
      listItem.textContent = member.name;
      const button = document.createElement('button');
      button.textContent = 'Delete User';
      button.id =`deleteButton_${member.id}`;
      listItem.appendChild(button);
      memberList.appendChild(listItem);
    });
  }

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
