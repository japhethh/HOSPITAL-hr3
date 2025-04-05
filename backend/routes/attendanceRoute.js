const express = require("express");
const attendanceRoute = express.Router();
const { euclideanDistance } = require("face-api.js");
const Employee = require("../models/Employee");
const TimeAndAttendance = require("../models/TimeAndAttendance");

// Register Employee Face
attendanceRoute.post("/register-face", async (req, res) => {
  try {
    const { employeeId, faceData, qualityScore } = req.body;

    if (!employeeId || !faceData || !qualityScore) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    if (qualityScore < 0.6) {
      return res
        .status(400)
        .json({ success: false, message: "Face quality too low" });
    }

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Store encrypted data (decryption should happen only during verification)
    employee.faceDescriptor = {
      encryptedData: faceData.encryptedData,
      iv: faceData.iv,
    };

    await employee.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

attendanceRoute.post("/clock-in", async (req, res) => {
  try {
    const { faceData, qualityScore } = req.body;

    // Input validation
    if (!faceData || !qualityScore) {
      return res
        .status(400)
        .json({ success: false, message: "Missing face data" });
    }

    if (qualityScore < 0.6) {
      return res
        .status(400)
        .json({ success: false, message: "Face quality too low" });
    }

    // Find matching employee (in production, use a more efficient face matching algorithm)
    const employees = await Employee.find({ isActive: true });
    let bestMatch = null;
    let smallestDistance = Infinity;

    for (const employee of employees) {
      // if (!employee.faceDescriptor) continue;

      // TODO: Replace with actual face distance calculation
      // This should compare the incoming faceData with employee.faceDescriptor
      const distance = Math.random();

      if (distance < smallestDistance) {
        smallestDistance = distance;
        bestMatch = employee;
      }
    }

    // Verify match quality
    if (!bestMatch || smallestDistance > 0.6) {
      return res
        .status(404)
        .json({ success: false, message: "No matching employee found" });
    }

    // Check for existing clock-in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await TimeAndAttendance.findOne({
      employeeId: bestMatch.employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Already clocked in today",
        lastClockIn: existingAttendance.clockIn,
      });
    }

    // Create new attendance record
    const attendanceRecord = new TimeAndAttendance({
      employeeId: bestMatch.employeeId,
      employeeName: bestMatch.name,
      department: bestMatch.department,
      date: today,
      clockIn: new Date(),
      status: "Present",
      remarks: "Face recognition clock-in",
    });

    await attendanceRecord.save();

    res.json({
      success: true,
      employee: bestMatch.name,
      department: bestMatch.department,
      clockInTime: attendanceRecord.clockIn,
    });
  } catch (error) {
    console.error("Clock in error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
module.exports = attendanceRoute;
