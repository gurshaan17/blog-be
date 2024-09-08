const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config();
require('./config/passport');

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
  };
  
app.use(cors(corsOptions));

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});