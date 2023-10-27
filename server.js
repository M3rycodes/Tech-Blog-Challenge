const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const blogController = require('./controllers/blogController');
const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const helpers = require('./models/helpers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); // Import the bcrypt library
const User = require('./models/user'); // Import your User model
const blogPost = require('./models/blogpost'); // Import your Post model

const app = express();
const PORT = process.env.PORT || 3000;

const sess = {
  secret: process.env.SESSION_SECRET || 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict', 
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// Set up Express to handle data parsing and static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure session and passport for authentication
app.use(session(sess));

// Configure handlebars
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Your route imports
const apiRoutes = require('./controllers/api/api-routes');
const htmlRoutes = require('./controllers/api/html-routes');

// Define your routes
app.get('/', (req, res) => {
  res.render('home');
});


app.get('/login', (req, res) => {
  res.render('login');
});

// Use the blogController for the main blog page
app.use('/', blogController);
// Use the authController for authentication-related routes
app.use('/auth', authController);
// Use the dashboardController for dashboard-related routes
app.use('/dashboard', dashboardController);
// Catch-all route for handling 404 errors
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

// Start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
