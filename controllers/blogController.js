const Blog = require('../models/blog');
const User = require('../models/user');

// Create blog
exports.createBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const blog = new Blog({
            title,
            content,
            author
        });
        await blog.save();
        res.status(201).json({ message: 'Blog submitted for approval' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Admin approve/reject blog
exports.approveBlog = async (req, res) => {
    try {
        const { blogId, status, adminComment } = req.body;
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        blog.status = status;
        blog.adminComment = adminComment;
        await blog.save();

        res.json({ message: `Blog ${status} successfully` });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// View blogs (public)
exports.getApprovedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'approved' }).populate('author');
        res.json(blogs);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// User dashboard to see blog statuses
exports.getUserBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.userId }).populate('author');
        res.json(blogs);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all blogs (admin)
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author');
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params; 
        const blog = await Blog.findById(id).populate('author');
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};