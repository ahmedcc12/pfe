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

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require('compression');
const timeout = require('connect-timeout');

// Connect to MongoDB
connectDB();

const setNoCacheHeaders = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};


// Apply rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // limit each IP to 10000 requests per windowMs
    message: "Too many requests, please try again later"
});
app.use(limiter);

app.use(setNoCacheHeaders);

// Set HTTP headers for security with Helmet
app.use(helmet());

// Sanitize user-supplied data against NoSQL Injection
app.use(mongoSanitize());


// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json({ limit: "10kb" }));

app.use(cookieParser());

app.use(compression());

app.use(timeout('3m'));


/* app.use((req, res, next) => {
    setTimeout(next, 2000);
}); */

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
app.use('/api/users/:matricule', require('./routes/api/users'));

app.use('/api/bots', require('./routes/api/bot'));
app.use('/api/bots/:name', require('./routes/api/bot'));

app.use('/api/groups', require('./routes/api/group'));
app.use('/api/groups/:id', require('./routes/api/group'));
app.use('/api/groups/:id/bots', require('./routes/api/group'));

app.use('/api/botinstances', require('./routes/api/botInstance'));
app.use('/api/botinstances/scheduled', require('./routes/api/botInstance'));
app.use('/api/botinstances/:id', require('./routes/api/botInstance'));
app.use('/api/botinstances/status/:userid/:botid', require('./routes/api/botInstance'));

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});