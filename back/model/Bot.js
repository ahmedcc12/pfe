const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const botSchema = new Schema({
    
    name: {
        type: String,
        required: true,
        unique: true
    },
    description:{ 
        type : String,
        required: true,
    },
    configuration:{
        downloadURL: {
            type : String,
            required: true,
        },
        path: {
            type : String,
            required: true,
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    logs: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        status: String,
        message: String
    }],    
    lastRun:Date,
    nextRun: Date
});

module.exports = mongoose.model('Bot', botSchema);