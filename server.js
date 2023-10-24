const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const blogController = require('./controllers/blogController');
const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); // Import the bcrypt library
const User = require('./models/user'); // Import your User model
const Post = require('./models/post'); // Import your Post model

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


// Configure session and passport for authentication
app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Set up Express to handle data parsing and static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

mongoose.connect(process.env.MONGOGB_URL || 'mongodb://localhost/mongoose', {
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
app.get('/edit/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      // Handle the case where the post with the given ID is not found
      return res.status(404).send('Post not found');
    }

    // Render the edit form with the post's data
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
    const post = await Post.findById(postId);
    if (!post) {
      // Handle the case where the post with the given ID is not found
      return res.status(404).send('Post not found');
    }

    // Delete the post
    await Post.findByIdAndRemove(postId);

    // Redirect to the dashboard or another appropriate page
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


app.use('/api', apiRoutes);
// app.use('/' , htmlRoutes);
app.use('/api', loginRoutes);
app.use('/api', logoutRoutes);

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
