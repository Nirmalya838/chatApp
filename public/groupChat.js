const url = new URL(window.location.href);
const pathname = url.pathname;
const groupName = decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1).split('+').pop());
const groupId = decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1).split('+')[0]);
document.getElementById('groupName').textContent = `Group: ${groupName}`;
const groupMessageList = document.getElementById('groupMessage-list');

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

    const newMessages = response.data;
    const messages = newMessages.slice(-10); // Only store the last 10 messages

    localStorage.setItem('messages', JSON.stringify(messages));
    document.getElementById('grpMsg').value = '';
    document.getElementById('grpMsg').focus();
  } catch (err) {
    console.log(err);
  }
}

document.getElementById('leaveGroup').addEventListener('click', () => {
    // Go back to the previous route
    window.history.back();
  });


  