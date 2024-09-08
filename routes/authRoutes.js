const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authController.googleCallback);
router.post('/register',authController.signup);
router.post('/loginmail',authController.loginmail)

module.exports = router;