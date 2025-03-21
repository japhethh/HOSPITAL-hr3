const mongoose = require("mongoose");

const SalarySchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, required: true },
  deductions: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model("Salary", SalarySchema);