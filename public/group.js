document.getElementById('submit').addEventListener('click', createGroup);

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
  
  async function createGroup(event) {
    event.preventDefault(); 
  
    const name = document.getElementById("group_name").value;
    const participantCheckboxes = document.querySelectorAll('input[name="participants"]:checked');
    const participants = Array.from(participantCheckboxes).map(checkbox => checkbox.value);
    const token = sessionStorage.getItem("token");
    const user = parseJwt(token);
  
    // Create an object with the group data
    const groupData = {
      group_name: name,
      participants: participants,
      created_by: user.username
    };

    console.log(groupData);
    
    try {
        // Send the group data to the server using axios with async/await
        const response = await axios.post('/createGroup/', groupData, {
          headers: { Authorization: token }
        });
        alert('Group Created successfully!');
        console.log('Group created:', response.data);
        // Optionally, you can perform additional actions after group creation
      } catch (error) {
        console.error('Error creating group:', error);
      }
  }

  
  
  