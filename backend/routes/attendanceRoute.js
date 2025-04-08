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

// Clock In with Face Verification
attendanceRoute.post("/clock-in", async (req, res) => {
  try {
    const { faceData, qualityScore } = req.body;

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

    const employees = await Employee.find({});
    let bestMatch = null;
    let smallestDistance = Infinity;

    for (const employee of employees) {
      if (!employee.faceDescriptor) continue;

      // Replace this with actual face distance calculation
      const distance = Math.random();

      if (distance < smallestDistance) {
        smallestDistance = distance;
        bestMatch = employee;
      }
    }

    if (!bestMatch || smallestDistance > 0.6) {
      return res
        .status(404)
        .json({ success: false, message: "No matching employee found" });
    }

    // Record attendance
    const attendanceRecord = new TimeAndAttendance({
      employeeId: bestMatch.employeeId,
      date: new Date(),
      clockIn: new Date().toISOString(),
      clockOut: "",
      totalHours: 0,
      status: "Present",
      remarks: "Face recognition clock-in",
      department: bestMatch.department || "General", // Default to "General" if not set
    });

    await attendanceRecord.save();

    res.json({
      success: true,
      employee: bestMatch.name || `Employee ${bestMatch.employeeId}`, // Fallback if name not set
      department: bestMatch.department || "General", // Fallback if department not set
    });
  } catch (error) {
    console.error("Clock in error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Clock Out with Face Verification
attendanceRoute.post("/clock-out", async (req, res) => {
  try {
    console.log("Clock-out request received");

    // Validate request body
    if (!req.body.faceData || !req.body.qualityScore) {
      return res.status(400).json({
        success: false,
        message: "Missing faceData or qualityScore in request",
      });
    }

    const { faceData, qualityScore } = req.body;

    // Validate quality score
    if (qualityScore < 0.6) {
      return res.status(400).json({
        success: false,
        message: "Face quality score too low (minimum 0.6 required)",
      });
    }

    // Find any employee with face data (simplified for testing)
    const employee = await Employee.findOne({
      "faceDescriptor.encryptedData": { $exists: true }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "No registered employees found",
      });
    }

    // Find today's attendance record
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const attendanceRecord = await TimeAndAttendance.findOne({
      employeeId: employee.employeeId,
      date: { $gte: todayStart, $lte: todayEnd },
      clockOut: { $exists: false }
    });

    if (!attendanceRecord) {
      return res.status(400).json({
        success: false,
        message: "No active clock-in found for today",
        employeeId: employee.employeeId
      });
    }

    // Update record
    attendanceRecord.clockOut = new Date();
    attendanceRecord.totalHours = 
      ((attendanceRecord.clockOut - new Date(attendanceRecord.clockIn)) / (1000 * 60 * 60))
    attendanceRecord.status = "Completed";
    
    await attendanceRecord.save();

    return res.json({
      success: true,
      message: "Clock out recorded successfully",
      employeeId: employee.employeeId,
      department: employee.department || "General",
      clockIn: attendanceRecord.clockIn,
      clockOut: attendanceRecord.clockOut,
      totalHours: attendanceRecord.totalHours.toFixed(2)
    });

  } catch (error) {
    console.error("Clock-out error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during clock-out",
      error: error.message
    });
  }
});

module.exports = attendanceRoute;
