const mongoose = require("mongoose");

const PayrollItemSchema = new mongoose.Schema(
  {
    description: String,
    amount: Number,
    type: { type: String, enum: ["earning", "deduction"] },
  },
  { _id: false }
);

const PayrollSystemSchema = new mongoose.Schema({
  employeeId: { type: String, required: false },
  name: { type: String, required: false },
  department: { type: String, required: false },
  position: { type: String, required: false },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  leave: { type: String, required: false, default: "Leave" },
  salary: { type: Number, required: false },
  hireDate: { type: Date, required: false },
  payPeriodStart: {
    type: Date,
    required: false,
  },
  payPeriodEnd: {
    type: Date,
    required: false,
  },
  baseSalary: {
    type: Number,
    required: false,
  },
  items: [PayrollItemSchema],
  totalEarnings: {
    type: Number,
    default: 0,
  },
  totalDeductions: {
    type: Number,
    default: 0,
  },
  netPay: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    enum: ["draft", "processed", "paid", "cancelled"],
    default: "draft",
  },
  paymentDate: Date,
  hoursWorked: Number,
  overtimeHours: Number,
  leaveDays: Number,

  status: { type: String, required: false },
});

module.exports = mongoose.model("PayrollSystem", PayrollSystemSchema);
