const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy; // Add this import
const passport = require('passport');
const User = require('../models/user'); // Ensure this path is correct
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName
        });
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

// Local Strategy for Email/Password
passport.use(new LocalStrategy({
  usernameField: 'email',    // Map 'email' field for login instead of the default 'username'
  passwordField: 'password'  // Password field
}, (email, password, done) => {
  // Find the user by email
  User.findOne({ email: email }, (err, user) => {
      if (err) return done(err);
      if (!user) {
          return done(null, false, { message: 'Email not registered' });
      }

      // Compare password with hashed password in the database
      bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
              return done(null, user); // Correct password
          } else {
              return done(null, false, { message: 'Incorrect password' });
          }
      });
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);  
      done(null, user);
  } catch (err) {
      done(err, null);
  }
});

module.exports = passport;