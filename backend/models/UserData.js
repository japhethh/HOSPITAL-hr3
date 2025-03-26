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
});

module.exports = mongoose.model("UserData", userSchema);
