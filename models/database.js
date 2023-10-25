const BlogPost = require('./blog-post');

const blogPosts = [];

function getBlogPosts() {
  return blogPosts;
}

function addBlogPost(blogPost) {
  blogPosts.push(blogPost);
}

module.exports = {
  getBlogPosts,
  addBlogPost,
};
