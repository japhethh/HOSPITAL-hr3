const express = require("express");
const attendanceRoute = express.Router();
const { euclideanDistance } = require("face-api.js");
const Employee = require("../models/Employee");
const TimeAndAttendance = require("../models/TimeAndAttendance");

// Register Employee Face
attendanceRoute.post("/register-face", async (req, res) => {
  const { employeeId, faceDescriptor } = req.body;

  const employee = await Employee.findOne({ employeeId });
  if (!employee) return res.status(404).send("Employee not found");

  employee.faceDescriptor = faceDescriptor;
  await employee.save();
  res.send({ success: true });
});

// Face Recognition Clock-In
attendanceRoute.post("/clock-in", async (req, res) => {
  const { faceDescriptor } = req.body;

  // 1. Find all employees with registered faces
  const employees = await Employee.find({ faceDescriptor: { $exists: true } });
  if (!employees.length)
    return res.status(404).send("No employees with registered faces");

  // 2. Compare face with each employee
  let matchedEmployee = null;
  for (const employee of employees) {
    const distance = euclideanDistance(employee.faceDescriptor, faceDescriptor);
    if (distance < 0.6) {
      // Threshold for match
      matchedEmployee = employee;
      break;
    }
  }

  if (!matchedEmployee) return res.status(401).send("Face not recognized");

  // 3. Record attendance in both schemas
  const now = new Date();
  const clockInTime = now.toLocaleTimeString();

  // Add to Employee's embedded attendance
  matchedEmployee.attendance.push({
    date: now,
    clockIn: clockInTime,
    clockOut: "00:00:00",
    totalHours: 0,
    status: "Present",
    remarks: "Face recognition clock-in",
  });

  // Also add to TimeAndAttendance collection
  await TimeAndAttendance.create({
    employeeId: matchedEmployee.employeeId,
    date: now,
    clockIn: clockInTime,
    clockOut: "00:00:00",
    totalHours: 0,
    status: "Present",
    remarks: "Face recognition clock-in",
    department: matchedEmployee.department,
  });

  await matchedEmployee.save();
  res.send({
    success: true,
    employee: `${matchedEmployee.firstName} ${matchedEmployee.lastName}`,
    department: matchedEmployee.department,
  });
});

module.exports = attendanceRoute;
