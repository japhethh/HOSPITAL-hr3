const express = require("express");
const router = express.Router();
const {
  // Employee
  createEmployeeController,
  getEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
  deleteEmployeeController,

  // EmployeeEngagement
  createEmployeeEngagementController,
  getEmployeeEngagementsController,
  getEmployeeEngagementByIdController,
  updateEmployeeEngagementController,
  deleteEmployeeEngagementController,

  // PayrollSystem
  createPayrollSystemController,
  getPayrollSystemsController,
  getPayrollSystemByIdController,
  updatePayrollSystemController,
  deletePayrollSystemController,

  // TimeAndAttendance
  createTimeAndAttendanceController,
  getTimeAndAttendancesController,
  getTimeAndAttendanceByIdController,
  updateTimeAndAttendanceController,
  deleteTimeAndAttendanceController,

  // EmployeeAssistantProgram
  createEmployeeAssistantProgramController,
  getEmployeeAssistantProgramsController,
  getEmployeeAssistantProgramByIdController,
  updateEmployeeAssistantProgramController,
  deleteEmployeeAssistantProgramController,

  // Leave
  createLeaveController,
  getLeavesController,
  getLeaveByIdController,
  updateLeaveController,
  deleteLeaveController,

  // Salary
  createSalaryController,
  getSalariesController,
  getSalaryByIdController,
  updateSalaryController,
  deleteSalaryController,
} = require("../controllers/hrController");

// Employee Routes
router.post("/employees", createEmployeeController);
router.get("/employees", getEmployeesController);
router.get("/employees/:id", getEmployeeByIdController);
router.put("/employees/:id", updateEmployeeController);
router.delete("/employees/:id", deleteEmployeeController);

// EmployeeEngagement Routes
router.post("/employee-engagements", createEmployeeEngagementController);
router.get("/employee-engagements", getEmployeeEngagementsController);
router.get("/employee-engagements/:id", getEmployeeEngagementByIdController);
router.put("/employee-engagements/:id", updateEmployeeEngagementController);
router.delete("/employee-engagements/:id", deleteEmployeeEngagementController);

// PayrollSystem Routes
router.post("/payroll-systems", createPayrollSystemController);
router.get("/payroll-systems", getPayrollSystemsController);
router.get("/payroll-systems/:id", getPayrollSystemByIdController);
router.put("/payroll-systems/:id", updatePayrollSystemController);
router.delete("/payroll-systems/:id", deletePayrollSystemController);

// TimeAndAttendance Routes
router.post("/time-and-attendances", createTimeAndAttendanceController);
router.get("/time-and-attendances", getTimeAndAttendancesController);
router.get("/time-and-attendances/:id", getTimeAndAttendanceByIdController);
router.put("/time-and-attendances/:id", updateTimeAndAttendanceController);
router.delete("/time-and-attendances/:id", deleteTimeAndAttendanceController);

// EmployeeAssistantProgram Routes
router.post("/employee-assistant-programs", createEmployeeAssistantProgramController);
router.get("/employee-assistant-programs", getEmployeeAssistantProgramsController);
router.get("/employee-assistant-programs/:id", getEmployeeAssistantProgramByIdController);
router.put("/employee-assistant-programs/:id", updateEmployeeAssistantProgramController);
router.delete("/employee-assistant-programs/:id", deleteEmployeeAssistantProgramController);

// Leave Routes
router.post("/leaves", createLeaveController);
router.get("/leaves", getLeavesController);
router.get("/leaves/:id", getLeaveByIdController);
router.put("/leaves/:id", updateLeaveController);
router.delete("/leaves/:id", deleteLeaveController);

// Salary Routes
router.post("/salaries", createSalaryController);
router.get("/salaries", getSalariesController);
router.get("/salaries/:id", getSalaryByIdController);
router.put("/salaries/:id", updateSalaryController);
router.delete("/salaries/:id", deleteSalaryController);

module.exports = router;