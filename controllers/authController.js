const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register user with email and password
exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = new User({ email, password, name });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Google login callback (handled by passport)
exports.googleCallback = (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
    res.redirect(`/dashboard?token=${token}`);
};