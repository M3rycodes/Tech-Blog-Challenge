const express = require('express');
const path = require('path');
const router = express.Router();

// Define your HTML routes here
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'main.handlebars'));
});

// Add more routes for other pages as needed

module.exports = router;
