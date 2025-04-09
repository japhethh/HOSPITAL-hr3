const mongoose = require("mongoose");

const PayrollItemSchema = new mongoose.Schema(
  {
    description: String,
    amount: Number,
    type: { type: String, enum: ["earning", "deduction"] },
  },
  { _id: false }
);

const PayrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      index: true,
    },
    payPeriodStart: {
      type: Date,
      required: true,
    },
    payPeriodEnd: {
      type: Date,
      required: true,
    },
    baseSalary: {
      type: Number,
      required: true,
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
      required: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payroll", PayrollSchema);
