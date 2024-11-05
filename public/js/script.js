// app.js

// Function to toggle between login and sign up pages
function toggleSignUp() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('signup-page').style.display = 'block';
  }
  
  function toggleLogin() {
    document.getElementById('signup-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
  }
  
  // Function to handle form submission for login
  