const mongoose = require("mongoose");

const EmployeeAssistantProgramSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  programName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, required: true },
  remarks: { type: String, required: true },
});

module.exports = mongoose.model("EmployeeAssistantProgram", EmployeeAssistantProgramSchema);