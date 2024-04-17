const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    readAt: Date,


}, { timestamps: true });

notificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Notification', notificationSchema);