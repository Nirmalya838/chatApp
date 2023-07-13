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

function getCurrentTime() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return time;
}

function outputUserJoined(username) {
  const userlist = document.getElementById('userlist');
  let user = document.createElement('li');
  user.textContent = `${username} joined.`;
  userlist.appendChild(user);
}

const messageList = document.getElementById('message-list');

document.getElementById('chat-form').addEventListener('submit', addChat);

async function addChat(event) {
  event.preventDefault();

  const msg = document.getElementById('msg').value;
  const token = sessionStorage.getItem("token");
  const user = parseJwt(token);

  const obj = {
    message: msg,
    userId: user.userId,
    username: user.username
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
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  let token = localStorage.getItem("token");
  const decode = parseJwt(token);
  const name = decode.username;
  outputUserJoined(name);

  function outputMessage({ id, message, username }) {
    const chatMessage = { id, message, username };
    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push(chatMessage);

    if (messages.length > 10) {
      messages = messages.slice(messages.length - 10);
    }

    localStorage.setItem('messages', JSON.stringify(messages));
    appendMessage(chatMessage);
  }

  function appendMessage({ message, username }) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${username}</strong> ${message}`;
    messageList.appendChild(listItem);
  }

  function loadMessagesFromLocalStorage() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messageList.innerHTML = '';

    messages.forEach(message => {
      appendMessage(message);
    });
  }

  function getNewMessages() {
    axios.get('/get-chat')
      .then(response => {
        const newMessages = response.data;
        const messages = newMessages.slice(-10); // Only retrieve the last 10 messages

        localStorage.setItem('messages', JSON.stringify(messages));
        messageList.innerHTML = '';

        messages.forEach(message => {
          appendMessage(message);
        });
      })
      .catch(error => {
        console.error('Error retrieving messages:', error);
      });
  }

  loadMessagesFromLocalStorage();
  setInterval(getNewMessages, 1000);

  document.getElementById('log').addEventListener('click', ()=>{
    window.location.href = '/login';
  })
});
