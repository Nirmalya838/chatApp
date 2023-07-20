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



window.addEventListener('DOMContentLoaded', async () => {

sessionStorage.setItem('Group_Id', null);
  
function outputUserJoined(username) {
  const userlist = document.getElementById('userlist');
  let user = document.createElement('li');
  user.textContent = `${username} joined.`;
  userlist.appendChild(user);
}

function updateToken(token) {
  const localToken = localStorage.getItem("token");
  if (!localToken) {
    localStorage.setItem("token", token);
  }
  const sessionToken = sessionStorage.getItem("token");
  if (!sessionToken) {
    sessionStorage.setItem("token", token);
  }
}

let token = localStorage.getItem("token");
if (!token) {
  token = sessionStorage.getItem("token");
}
if (token) {
  updateToken(token);
}

const decode = parseJwt(token);
const name = decode.username;
//outputUserJoined(name);

const socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log(socket.id);
  outputUserJoined(name);
})

socket.on('receive-message', (usermsg, username) => {

console.log(usermsg)
  // Create a new object containing both username and usermsg
  const messageData = {
    username: username,
    message: usermsg
  };

  // Call the appendMessage function with the messageData object
  appendMessage(messageData);
});


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
    username: user.username,
    GroupGroupId: null 
  };

  try {
    let response = await axios.post(
      "/add-chat",
      obj,
      { headers: { Authorization: token }});

    const newMessages = response.data;
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    socket.emit('send-message', obj.GroupGroupId, obj.message, obj.username);
    const filteredMessages = storedMessages.filter(message => message.GroupGroupId === null);
    const updatedMessages = [...filteredMessages, ...newMessages].slice(-10);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
    getNewMessages();
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();
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
     const response=await axios.post(`http://localhost:3000/chat/sendfile/${groupId}`,formData,{headers:{"Authorization":token,'Content-Type':'multipart/form-data'}});
     const newMessages = response.data;
     const user = parseJwt(token);
     const lastmessage = response.data[0]; 
     console.log(lastmessage)
     const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
     socket.emit('send-message', groupId, lastmessage.message, user.username);
     const filteredMessages = storedMessages.filter(message => message.GroupGroupId == null);
     const updatedMessages = [...filteredMessages, ...newMessages].slice(-10);
     localStorage.setItem('messages', JSON.stringify(updatedMessages));
     getNewMessages();
     console.log(response);
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

      function appendMessage({ message, username }) {
        const listItem = document.createElement('li');
        const messageContent = isLink(message) ? `<strong>${username}</strong> <a href="${message}" target="_blank">${message}</a>` : `<strong>${username}</strong> ${message}`;
        listItem.innerHTML = messageContent;
        messageList.appendChild(listItem);
      }
      
      // Function to check if the message is a link
      function isLink(message) {
        // Regular expression to match URL patterns (https://stackoverflow.com/a/3809435)
        const urlPattern = new RegExp('^https?://.+');
        return urlPattern.test(message);
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
        const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];

        const filteredMessages = newMessages.filter(message => message.GroupGroupId == null);
        const updatedMessages = filteredMessages.slice(-10);

        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        messageList.innerHTML = '';

        updatedMessages.forEach(message => {
          appendMessage(message);
        });
      })
      .catch(error => {
        console.error('Error retrieving messages:', error);
      });
  }

  loadMessagesFromLocalStorage();
  getNewMessages();

  document.getElementById('log').addEventListener('click', () => {
    window.location.href = '/login';
  });

  document.getElementById('topLeftButton').addEventListener('click', showPopup);

  function showPopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "block";
  }

  document.getElementById('close').addEventListener('click', hidePopup);

  function hidePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
  }

  document.getElementById('topLeftButton').addEventListener('click', populateCheckboxOptions);

  async function populateCheckboxOptions() {
    var checkboxOptions = document.getElementById("checkboxOptions");
    checkboxOptions.innerHTML = '';

    try {
      const response = await axios.get('/all-users');
      const users = response.data;

      users.forEach(function(user) {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "participants";
        checkbox.value = user.name;

        var label = document.createElement("label");
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(user.name));

        checkboxOptions.appendChild(label);
        checkboxOptions.appendChild(document.createElement('br'));
      });
    } catch (error) {
      console.error('Error retrieving users:', error);
    }
  }

  async function displayGroupNames() {
    try {
      const response = await axios.get("/participatedGroups");

      if (response.status === 200) {
        const participationData = response.data;
        const groupData = participationData.groupData;
        const token = sessionStorage.getItem("token");
        const user = parseJwt(token);
        const userId = user.userId;

        const associatedGroupData = groupData.filter(group => group.userId === userId);
        const groupIds = associatedGroupData.map(group => group.GroupGroupId);

        const groupNamesResponse = await axios.get("/group-names");
        const groupNamesData = groupNamesResponse.data;

        const groupContainer = document.getElementById("grouplist");
        groupContainer.innerHTML = "";

        groupIds.forEach(groupId => {
          const group = groupNamesData.groupName.find(group => group.group_id == groupId);
          if (group) {
            const button = document.createElement("button");
            button.textContent = group.group_name;
            button.classList.add("group-button");
            button.id = group.group_id;
            button.style.margin = "5px";
            button.style.padding = "10px";
            button.style.backgroundColor = "red";
            button.style.color = "black";
            button.style.fontWeight = 'bold';
            button.style.border = "none";
            button.style.borderRadius = '8px'
            button.style.cursor = "pointer";

            button.addEventListener("mouseenter", () => {
              button.style.backgroundColor = "blue";
            });

            button.addEventListener("mouseleave", () => {
              button.style.backgroundColor = "red";
            });

            button.addEventListener("click", () => {
              handleGroupButtonClick(group.group_id, group.group_name);
            });

            groupContainer.appendChild(button);
          }
        });
      } else {
        console.error("Failed to retrieve user participation data");
      }
    } catch (error) {
      console.error("Error occurred while retrieving user participation data", error);
    }
  }

  displayGroupNames();

  function handleGroupButtonClick(groupId, groupName) {
    // Add code to fetch and display group members' names and isAdmin status
    fetch(`/groups/${groupId}/members`)
      .then(response => response.json())
      .then(data => {
        const members = data.members;
        const group_id = data.group_id;
        sessionStorage.setItem('Group_Id', JSON.stringify(group_id));
        window.location.href = `/group-chat/${groupId}+${groupName}`;
        function disconnectSocket() {
          socket.close();
        }
        disconnectSocket();
      })
      .catch(error => console.error('Error retrieving group members:', error));
  }
  

});
