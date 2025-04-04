const mongoose = require("mongoose");

const EmployeeEngagementSchema = new mongoose.Schema({
  employeeId: { type: String, required: false },
  engagementType: { type: String, required: false },
  engagementDate: { type: Date, required: false },
  engagementDetails: { type: String, required: false },
  facilitator: { type: String, required: false },
  status: { type: String, required: false },
  outcome: { type: String, required: false },
  remarks: { type: String, required: false },
});

module.exports = mongoose.model("EmployeeEngagement", EmployeeEngagementSchema);
