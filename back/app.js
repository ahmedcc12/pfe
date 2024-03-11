require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 3500;
var nodemailer = require('nodemailer');


// Connect to MongoDB
connectDB();


// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/refresh', require('./routes/refresh'))
app.use('/api/logout', require('./routes/logout'));
app.use('/api/auth/forgotpassword', require('./routes/auth'));
app.use('/api/auth/resetpassword', require('./routes/auth'));
app.use('/api/auth/resetpassword/:token', require('./routes/auth'));

app.use(verifyJWT);
app.use('/api/register', require('./routes/register'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/users/userbots', require('./routes/api/users'));
app.use('/api/users/:matricule', require('./routes/api/users'));
app.use('/api/bots', require('./routes/api/bot'));
app.use('/api/bots/:name', require('./routes/api/bot'));


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});