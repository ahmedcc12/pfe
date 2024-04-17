const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  avatarUrl: {
    downloadURL: {
      type: String,
    },
    path: {
      type: String,
    },
  },

  matricule: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
  },

  group: {
    type: Schema.Types.ObjectId,
    ref: "Group",
  },

  refreshToken: String,
  resetToken: String,
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", userSchema);
