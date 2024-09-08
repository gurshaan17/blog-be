const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const cors = require('cors');
require('dotenv').config();
require('./config/passport');


const corsOptions = {
    origin: ['http://localhost:5173', 'https://blog-gurshaan.vercel.app'],
    credentials: true 
};

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);

app.listen(4000, () => { 
    console.log('Server running on port 4000');
});