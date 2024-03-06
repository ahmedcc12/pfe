const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    _id: String,
    matricule: {
        type: String,
        required: true,
        unique: true
    },
    email:{ 
        type : String,
        required: true,
        unique: true
    },
    firstname:{ 
        type : String,
        required: true,
    },
    lastname:{
        type : String,
        required: true,
    },
    department:{
        type : String,
        required: true,
    },
    password:{ 
        type : String,
        required: true,
        },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user']
    },
    access: [String],
    refreshToken: String,
    resetToken: String
});

module.exports = mongoose.model('User', userSchema);
