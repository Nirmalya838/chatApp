const submit = document.getElementById('submit');

submit.addEventListener('click', AddUser);

async function AddUser(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;

  const obj = {
    name: name,
    email: email,
    phone: phone,
    password: password,
  };

    try {
      const response = await axios.post('/signup', obj);
      alert('User Signed Up successfully!');
      location.reload();
    } catch (err) {
      const errorElement = document.getElementById('error-message');
      if (err.response.status == 400) {
        errorElement.textContent = "Email already exists!";
        errorElement.style.color = "red";
      } else {
        errorElement.textContent = "An error occurred. Please try again later.";
      }
      console.log('Error occurred:', err.message);
    }
  } 
