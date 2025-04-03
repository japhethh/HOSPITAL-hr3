const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  role: {
    type: String,
    enum: ["superAdmin", "admin", "staff", "employee", "regular", "contract"],
  },
  password: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
});

module.exports = mongoose.model("UserData", userSchema);
