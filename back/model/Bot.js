const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const botSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
    },
  },
  guide: {
    type: String,
    required: true,
  },
});

botSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Bot", botSchema);
