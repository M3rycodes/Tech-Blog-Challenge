// dashboardController.js

const express = require('express');
const router = express.Router();
const Post = require('../models/post'); // Import your Post model

// Handle GET request to the dashboard page
router.get('/dashboard', async (req, res) => {
  try {
    const posts = await Post.find(); // Retrieve posts from your database
    res.render('dashboard', {
      pageTitle: 'Dashboard',
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching posts');
  }
});

// Handle POST request to create a new post
router.post('/create', async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = new Post({ title, content });
    await newPost.save();
    res.redirect('/dashboard'); // Redirect to the dashboard after creating a post
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating post');
  }
});

// Handle GET request to edit an existing post
router.get('/edit/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    res.render('edit', {
      pageTitle: 'Edit Post',
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching post for editing');
  }
});

// Handle POST request to update an existing post
router.post('/edit/:id', async (req, res) => {
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

// Handle GET request to delete an existing post
router.get('/delete/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    await Post.findByIdAndRemove(postId);
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting post');
  }
});

module.exports = router;
