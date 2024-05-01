const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;

const adminMessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    solved: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  { timestamps: true }
);

adminMessageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Message", adminMessageSchema);
