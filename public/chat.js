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

window.addEventListener('DOMContentLoaded', async () => {
  let token = localStorage.getItem("token");
  const decode = parseJwt(token);
  const name = decode.username;
  outputUserJoined(name);

  const chatForm = document.getElementById('chat-form');
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    const currentTime = getCurrentTime();
    outputMessage({ message: msg, sender: name, time: currentTime });
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();
  });

  window.addEventListener('storage', (event) => {
    if (event.key === 'loggedInUsers') {
      const loggedInUsers = JSON.parse(event.newValue);
      updateUsersList(loggedInUsers);
    }
  });

  function updateUsersList(loggedInUsers) {
    const userlist = document.getElementById('userlist');
    userlist.innerHTML = ''; // Clear existing user list

    for (const username of loggedInUsers) {
      outputUserJoined(username);
    }
  }

  // Initial update of user list
  const loggedInUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
  updateUsersList(loggedInUsers);

  // Add the current user to the list of logged-in users
  loggedInUsers.push(name);
  localStorage.setItem('loggedInUsers', JSON.stringify(loggedInUsers));

  document.getElementById('log').addEventListener('click', () => {
    // Remove the current user from the list of logged-in users
    const loggedInUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
    const index = loggedInUsers.indexOf(name);
    if (index > -1) {
      loggedInUsers.splice(index, 1);
      localStorage.setItem('loggedInUsers', JSON.stringify(loggedInUsers));
    }
    
    window.location.href = '/login';
  });
});
