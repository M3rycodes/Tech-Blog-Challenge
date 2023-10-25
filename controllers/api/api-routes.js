const express = require('express');
const router = express.Router();


// Define your API routes here
router.get('/api/message', (req, res) => {
  res.json(users);
});

// You can add more routes for CRUD operations on users

module.exports = router;
