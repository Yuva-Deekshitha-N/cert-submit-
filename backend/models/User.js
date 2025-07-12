const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: function () {
      return this.authType !== 'google';
    },
  },

  authType: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },

  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student',
  },
});

module.exports = mongoose.model("User", UserSchema);
