const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection'); // Import your Sequelize connection

const Comment = sequelize.define('Comment', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Define associations with the User and BlogPost models
Comment.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Comment.belongsTo(BlogPost, {
  foreignKey: 'blogPostId',
  onDelete: 'CASCADE',
});

module.exports = Comment;
