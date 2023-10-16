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
});

// Define association with the User model
BlogPost.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

module.exports = BlogPost;
