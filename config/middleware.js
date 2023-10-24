const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const sequelize = require('../models').sequelize;

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// Configure session management
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use the secret key from .env
    resave: false,
    saveUninitialized: true,
  })
);

module.exports = app;
