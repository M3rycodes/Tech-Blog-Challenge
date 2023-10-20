const express = require('express');
const passport = require('passport');
const router = express.Router();

// Handle POST request to /api/login
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Login successful' });
});

module.exports = router;
