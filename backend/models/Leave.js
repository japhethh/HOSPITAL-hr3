const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  leaveType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, required: true },
  approver: { type: String, required: true },
  appliedDate: { type: Date, required: true },
  approvalDate: { type: Date },
  rejectionReason: { type: String },
});

module.exports = mongoose.model("Leave", LeaveSchema);