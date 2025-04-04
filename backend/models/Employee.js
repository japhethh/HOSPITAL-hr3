const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  clockIn: { type: String, required: true },
  clockOut: { type: String, required: true },
  totalHours: { type: Number, required: true },
  status: { type: String, required: true },
  remarks: { type: String, required: true },
});

const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  hireDate: { type: Date, required: true },
  salary: { type: Number, required: true },
  status: { type: String, required: true },
  attendance: [AttendanceSchema], // Embedded schema for attendance
  faceDescriptor: { type: Array }, // NEW: Store facial recognition data
});

module.exports = mongoose.model("Employee", EmployeeSchema);
