const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


// Handle POST request to /api/signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'User registration failed' });
    }
});

module.exports = router;
