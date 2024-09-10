const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const cors = require('cors');
require('dotenv').config();
require('./config/passport');
const app = express();

const corsOptions = {
    origin: ['http://localhost:5173', 'https://blog-gurshaan.vercel.app','https://blog-nextjs-gurshaan.vercel.app/','http://localhost:3000'],
    credentials: true 
};

app.use(session({
    secret: 'yourSecretKey',  // Replace with a strong secret key in production
    resave: false,            // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: {
        secure: false,        // Set to true if using HTTPS
        httpOnly: true,       // Prevents client-side JS from accessing the cookie
        maxAge: 1000 * 60 * 60 * 24 * 30 // Cookie expiry: 30 days
    }
}));


app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors(corsOptions));
app.use(passport.session()); 

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);

app.listen(4000, () => { 
    console.log('Server running on port 4000');
});