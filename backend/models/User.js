// models/User.js
const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otp: Number,
  isVerified: { type: Boolean, default: false },
  googleId: String,
  role: { type: String, default: "user" },
  profilePic: { type: String, default: "" },
  phone: { type: String, default: "" },
  isPhoneVerified: { type: Boolean, default: false },
  hasReviewed: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
