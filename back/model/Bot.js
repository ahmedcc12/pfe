const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;


const botSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    configuration: {
        downloadURL: {
            type: String,
            required: true,
        },
        path: {
            type: String,
            required: true,
        }
    },
    /*logs: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        status: String,
        message: String
    }],
    lastRun: Date,
    nextRun: Date,
    schedule: {
        type: String,
        required: false
    },
    isScheduled: {
        type: Boolean,
        default: false
    }*/
});

botSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Bot', botSchema);