const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    bots: [{
        type: Schema.Types.ObjectId,
        ref: 'Bot'
    }]
});

groupSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Group', groupSchema);
