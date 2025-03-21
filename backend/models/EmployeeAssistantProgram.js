const mongoose = require("mongoose");

const EmployeeEngagementSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    engagementType: { type: String, required: true },
    engagementDate: { type: Date, required: true },
    engagementDetails: { type: String, required: true },
    facilitator: { type: String, required: true },
    status: { type: String, required: true },
    outcome: { type: String, required: true },
    remarks: { type: String, required: true },
});

module.exports = mongoose.model("EmployeeEngagement", EmployeeEngagementSchema);