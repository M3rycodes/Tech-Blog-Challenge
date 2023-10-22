const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); // Import the bcrypt library
const User = require('./models/user'); // Import your User model
const connection = require('../config/connection');
const Post = require('./models/post'); // Import your Post model



const app = express();
const PORT = process.env.PORT || 3000;


// Configure session and passport for authentication
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

app.engine('handlebars', hbs.engine);
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Set up Express to handle data parsing and static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));

// Import and use your route files
const apiRoutes = require('./routes/api-routes');
const htmlRoutes = require('./routes/html-routes');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');

// Passport configuration should come before defining routes
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'Incorrect username.' });

            bcrypt.compare(password, user.password, (err, res) => {
                if (res) return done(null, user);
                else return done(null, false, { message: 'Incorrect password.' });
            });
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
      done(err, user);
  });
});

mongoose.connect('mongodb://localhost/mongoose', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.post('/create', async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = new Post({ title, content });
    await newPost.save();
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating post');
  }
});


// Edit an existing post
app.get('/edit/:id/edit', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    res.render('edit', { post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching post for editing');
  }
});

// Update an existing post
app.post('/edit/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  try {
    await Post.findByIdAndUpdate(postId, { title, content });
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating post');
  }
});

// Delete an existing post
app.get('/delete/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    await Post.findByIdAndRemove(postId);
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting post');
  }
});



// Define your routes here
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/dashboard', (req, res) => {
  const posts = [];
  res.render('dashboard', { posts } );
});


app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/edit/:id', (req, res) => {
  // Render a form to edit the selected post
  // Populate the form with the post's current data
});

app.get('/delete/:id', (req, res) => {
  // Handle the deletion of the selected post from your database
  // Redirect to the dashboard or another appropriate page
});

app.use('/api', apiRoutes);
// app.use('/' , htmlRoutes);
app.use('/api', loginRoutes);
app.use('/api', logoutRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
