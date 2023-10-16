const express = require('express');
const session = require('express-session');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure session and passport for authentication
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Set up Express to handle data parsing and static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Import and use your route files
const apiRoutes = require('./routes/api-routes');
const htmlRoutes = require('./routes/html-routes');
app.use(apiRoutes);
app.use(htmlRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
