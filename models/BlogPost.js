// BlogPost.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection'); // Import your Sequelize connection

const BlogPost = sequelize.define('BlogPost', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user', // Reference to the User model
      key: 'id',
    },
  },
});

module.exports = BlogPost;
