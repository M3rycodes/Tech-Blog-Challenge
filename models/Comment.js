const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection'); // Import your Sequelize connection
const router = require('express').Router();

const commentsController = require('../controllers/comments');

router.post('/', commentsController.createComment);
router.get('/: ');




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
