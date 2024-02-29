const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectWithDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to the database');
    } catch (error) {
        console.log('Error connecting to the database', error);
    }
}

module.exports = connectWithDB;