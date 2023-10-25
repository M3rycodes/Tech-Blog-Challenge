const express = require('express');
const handlebars = require('handlebars');
const passport = require('passport');

const app = express();

// Set the view engine to Handlebars
app.set('view engine', 'handlebars');

// Create a route to render the homepage
app.get('/', (req, res) => {
  // Get the blog posts from the database
  const blogPosts = getBlogPosts();

  // Render the homepage template
  res.render('homepage', { blogPosts });
});

//Create a local authentication strategy
passport.use(new LocalStrategy((username, password, done) => {
  // Find the user by username
  User.findOne({ username }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false);
    }

    // Verify the password
    if (!user.verifyPassword(password)) {
      return done(null, false);
    }

    // Return the user
    return done(null, user);
  });
}));

// Start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
