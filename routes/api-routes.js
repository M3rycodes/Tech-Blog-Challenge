const express = require('express');
const router = express.Router();
const users = require('./user');

// Define your API routes here
router.get('/users', (req, res) => {
  res.json(users);
});

// You can add more routes for CRUD operations on users

module.exports = router;
