const express = require('express');
const router = express.Router();
const { createPost, getPosts, updatePost, deletePost } = require('../controllers/postsController');
const { verifyToken } = require('../middleware/authMiddleware');

// Create a new post
router.post('/', verifyToken, createPost);

// Fetch all posts
router.get('/', getPosts);

// Update a post
router.put('/:id', verifyToken, updatePost);

// Delete a post
router.delete('/:id', verifyToken, deletePost);

module.exports = router;
