const express = require("express");
const attendanceRoute = express.Router();
const { euclideanDistance } = require("face-api.js");
const Employee = require("../models/Employee");
const TimeAndAttendance = require("../models/TimeAndAttendance");
const PayrollSystem = require("../models/PayrollSystem");

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
      clockIn: new Date(),
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

// Clock Out with Face Verification - Fixed Version
attendanceRoute.post("/clock-out", async (req, res) => {
  try {
    const { faceData, qualityScore } = req.body;

    // Validate request
    if (!faceData || !qualityScore) {
      return res.status(400).json({
        success: false,
        message: "Missing faceData or qualityScore in request",
      });
    }

    if (qualityScore < 0.6) {
      return res.status(400).json({
        success: false,
        message: "Face quality score too low (minimum 0.6 required)",
      });
    }

    // Get all employees with face descriptors
    const employees = await Employee.find({
      "faceDescriptor.encryptedData": { $exists: true },
    });

    if (!employees.length) {
      return res.status(404).json({
        success: false,
        message: "No registered employees found",
      });
    }

    // Find best matching employee
    let bestMatch = null;
    let smallestDistance = Infinity;

    for (const employee of employees) {
      if (!employee.faceDescriptor) continue;

      const distance = Math.random(); // Replace with actual face distance calculation

      if (distance < smallestDistance) {
        smallestDistance = distance;
        bestMatch = employee;
      }
    }

    if (!bestMatch || smallestDistance > 0.6) {
      return res.status(404).json({
        success: false,
        message: "No matching employee found",
      });
    }

    // Find today's attendance record
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setUTCHours(23, 59, 59, 999);

    const attendanceRecord = await TimeAndAttendance.findOne({
      employeeId: bestMatch.employeeId,
    });

    if (!attendanceRecord) {
      return res.status(400).json({
        success: false,
        message: "No active clock-in found for today",
        employeeId: bestMatch.employeeId,
      });
    }

    // Update record with proper date handling
    const clockOutTime = new Date();

    // Ensure clockIn is a valid Date object
    let clockInTime;
    if (attendanceRecord.clockIn instanceof Date) {
      clockInTime = attendanceRecord.clockIn;
    } else {
      clockInTime = new Date(attendanceRecord.clockIn);
      if (isNaN(clockInTime.getTime())) {
        throw new Error("Invalid clockIn date format");
      }
    }

    // Calculate hours worked
    const hoursWorked = (clockOutTime - clockInTime) / (1000 * 60 * 60);

    if (isNaN(hoursWorked)) {
      throw new Error("Invalid hours calculation");
    }

    attendanceRecord.clockOut = clockOutTime;
    attendanceRecord.totalHours = parseFloat(hoursWorked.toFixed(2));
    attendanceRecord.status = hoursWorked >= 8 ? "Completed" : "Short Hours";

    await attendanceRecord.save();

    
    const payrollRecord = await PayrollSystem.findOne({
      employeeId: bestMatch.employeeId,
    })

    if(!payrollRecord){
      const newPayrollRecord = new PayrollSystem({
        employeeId:bestMatch.employeeId,
        name: bestMatch.name || `Employee ${bestMatch.employeeId}`,
        department: bestMatch.department || "",
        position: bestMatch.position || "",
        email: bestMatch.email || "",
        phone: bestMatch.phone || "",
        leave: bestMatch.leave || "",
        salary: bestMatch.salary || 0,
        hireDate: bestMatch.hireDate || new Date(),
        payPeriodStart: new Date(),
        payPeriodEnd: new Date(),
        baseSalary: bestMatch.salary || 0,
        netPay: 0,
        status:"draft",
        paymentDate: new Date(),
        hoursWorked: attendanceRecord.totalHours,
        overtimeHours: 0, 
        leaveDays: 0,
      })

      newPayrollRecord.save()
    }else{
      
    }
    console.log(payrollRecord)


    return res.json({
      success: true,
      message: "Clock out recorded successfully",
      employee: bestMatch.name || `Employee ${bestMatch.employeeId}`,
      department: bestMatch.department || "General",
      clockIn: clockInTime.toISOString(),
      clockOut: clockOutTime.toISOString(),
      totalHours: attendanceRecord.totalHours,
    });
  } catch (error) {
    console.error("Clock-out error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during clock-out",
      error: error.message,
    });
  }
});

module.exports = attendanceRoute;
