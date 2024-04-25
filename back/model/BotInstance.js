const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const botSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bot: {
    type: Schema.Types.ObjectId,
    ref: "Bot",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "stopped", "error", "success"],
  },
  logs: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      status: String,
      message: String,
    },
  ],
  StartedAt: Date,
  StoppedAt: Date,
  isScheduled: {
    type: Boolean,
    default: false,
  },
  scheduledAt: {
    type: Date,
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
});

botSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("BotInstance", botSchema);
