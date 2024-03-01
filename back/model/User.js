const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{ 
        type : String,
        required: true,
        unique: true
    },
    name:{ 
        type : String,
        required: true,
        unique: true
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
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);
