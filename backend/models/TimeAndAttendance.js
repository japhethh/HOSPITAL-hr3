const mongoose = require("mongoose");

const TimeAndAttendanceSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    date: { type: Date, required: true },
    clockIn: { type: String, required: true },
    clockOut: { type: String, required: true },
    totalHours: { type: Number, required: true },
    status: { type: String, required: true },
    remarks: { type: String, required: true },
});

module.exports = mongoose.model("TimeAndAttendance", TimeAndAttendanceSchema);