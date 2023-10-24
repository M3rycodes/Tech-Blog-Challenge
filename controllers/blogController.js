// blogController.js

const express = require('express');
const router = express.Router();

// Handle GET request to the blog page
router.get('/', (req, res) => {
  res.render('main', {
    pageTitle: 'The Tech Blog',
    // Add any other data you want to pass to the main.handlebars template
  });
});

module.exports = router;
