const mongoose = require("mongoose");

const TimeAndAttendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: false },
  date: { type: Date, required: false },
  clockIn: { type: String, required: false },
  clockOut: { type: String, required: false },
  totalHours: { type: Number, required: false },
  status: { type: String, required: false },
  remarks: { type: String, required: false },
  department: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("TimeAndAttendance", TimeAndAttendanceSchema);
