const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: false },
  clockIn: { type: String, required: false },
  clockOut: { type: String, required: false },
  totalHours: { type: Number, required: false },
  status: { type: String, required: false },
  remarks: { type: String, required: false },
});

const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  department: { type: String, required: false },
  position: { type: String, required: false },
  hireDate: { type: Date, required: false },
  salary: { type: Number, required: false },
  status: { type: String, required: false },
  attendance: [AttendanceSchema], // Embedded schema for attendance
  faceDescriptor: { type: mongoose.Schema.Types.Mixed, required: false },
  // faceDescriptor: {
  //   encryptedData: { type: [Number], required: true },
  //   iv: { type: [Number], required: true },
  // },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
