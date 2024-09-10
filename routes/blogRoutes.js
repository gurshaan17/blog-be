const express = require('express');
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.post('/create', auth, blogController.createBlog);
router.get('/public', blogController.getApprovedBlogs);
router.get('/dashboard', auth, blogController.getUserBlogs);
router.post('/approve', auth, admin, blogController.approveBlog);
router.get('/all', auth, admin, blogController.getAllBlogs);
router.get('/:id', auth, blogController.getBlogById);

module.exports = router;