// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
      return this.authType !== 'google'; // password is only required for local login
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

module.exports = mongoose.model("User", userSchema);
