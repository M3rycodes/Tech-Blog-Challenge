// authController.js

const express = require('express');
const router = express.Router();

// Handle GET request to the login page
router.get('/login', (req, res) => {
  res.render('login', {
    pageTitle: 'Login',
    // Add any other data you want to pass to the login.handlebars template
  });
});

// Handle POST request to process login
router.post('/login', (req, res) => {
  // Handle the login logic here
  // Redirect or render a response based on login success or failure
});

// Handle GET request to the registration page
router.get('/registration', (req, res) => {
  res.render('registration', {
    pageTitle: 'Registration',
    // Add any other data you want to pass to the registration.handlebars template
  });
});

// Handle POST request to process registration
router.post('/registration', (req, res) => {
  // Handle the registration logic here
  // Redirect or render a response based on registration success or failure
});

module.exports = router;
