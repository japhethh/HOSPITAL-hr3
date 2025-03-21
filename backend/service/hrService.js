const Employee = require("../models/Employee");
const EmployeeEngagement = require("../models/EmployeeEngagement");
const PayrollSystem = require("../models/PayrollSystem");
const TimeAndAttendance = require("../models/TimeAndAttendance");
const EmployeeAssistantProgram = require("../models/EmployeeAssistantProgram");
const Leave = require("../models/Leave");
const Salary = require("../models/Salary");

// Employee CRUD Operations
const createEmployee = async (data) => await Employee.create(data);
const getEmployees = async () => await Employee.find();
const getEmployeeById = async (id) => await Employee.findById(id);
const updateEmployee = async (id, data) => await Employee.findByIdAndUpdate(id, data, { new: true });
const deleteEmployee = async (id) => await Employee.findByIdAndDelete(id);

// EmployeeEngagement CRUD Operations
const createEmployeeEngagement = async (data) => await EmployeeEngagement.create(data);
const getEmployeeEngagements = async () => await EmployeeEngagement.find();
const getEmployeeEngagementById = async (id) => await EmployeeEngagement.findById(id);
const updateEmployeeEngagement = async (id, data) => await EmployeeEngagement.findByIdAndUpdate(id, data, { new: true });
const deleteEmployeeEngagement = async (id) => await EmployeeEngagement.findByIdAndDelete(id);

// PayrollSystem CRUD Operations
const createPayrollSystem = async (data) => await PayrollSystem.create(data);
const getPayrollSystems = async () => await PayrollSystem.find();
const getPayrollSystemById = async (id) => await PayrollSystem.findById(id);
const updatePayrollSystem = async (id, data) => await PayrollSystem.findByIdAndUpdate(id, data, { new: true });
const deletePayrollSystem = async (id) => await PayrollSystem.findByIdAndDelete(id);

// TimeAndAttendance CRUD Operations
const createTimeAndAttendance = async (data) => await TimeAndAttendance.create(data);
const getTimeAndAttendances = async () => await TimeAndAttendance.find();
const getTimeAndAttendanceById = async (id) => await TimeAndAttendance.findById(id);
const updateTimeAndAttendance = async (id, data) => await TimeAndAttendance.findByIdAndUpdate(id, data, { new: true });
const deleteTimeAndAttendance = async (id) => await TimeAndAttendance.findByIdAndDelete(id);

// EmployeeAssistantProgram CRUD Operations
const createEmployeeAssistantProgram = async (data) => await EmployeeAssistantProgram.create(data);
const getEmployeeAssistantPrograms = async () => await EmployeeAssistantProgram.find();
const getEmployeeAssistantProgramById = async (id) => await EmployeeAssistantProgram.findById(id);
const updateEmployeeAssistantProgram = async (id, data) => await EmployeeAssistantProgram.findByIdAndUpdate(id, data, { new: true });
const deleteEmployeeAssistantProgram = async (id) => await EmployeeAssistantProgram.findByIdAndDelete(id);

// Leave CRUD Operations
const createLeave = async (data) => await Leave.create(data);
const getLeaves = async () => await Leave.find();
const getLeaveById = async (id) => await Leave.findById(id);
const updateLeave = async (id, data) => await Leave.findByIdAndUpdate(id, data, { new: true });
const deleteLeave = async (id) => await Leave.findByIdAndDelete(id);

// Salary CRUD Operations
const createSalary = async (data) => await Salary.create(data);
const getSalaries = async () => await Salary.find();
const getSalaryById = async (id) => await Salary.findById(id);
const updateSalary = async (id, data) => await Salary.findByIdAndUpdate(id, data, { new: true });
const deleteSalary = async (id) => await Salary.findByIdAndDelete(id);

module.exports = {
  // Employee
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,

  // EmployeeEngagement
  createEmployeeEngagement,
  getEmployeeEngagements,
  getEmployeeEngagementById,
  updateEmployeeEngagement,
  deleteEmployeeEngagement,

  // PayrollSystem
  createPayrollSystem,
  getPayrollSystems,
  getPayrollSystemById,
  updatePayrollSystem,
  deletePayrollSystem,

  // TimeAndAttendance
  createTimeAndAttendance,
  getTimeAndAttendances,
  getTimeAndAttendanceById,
  updateTimeAndAttendance,
  deleteTimeAndAttendance,

  // EmployeeAssistantProgram
  createEmployeeAssistantProgram,
  getEmployeeAssistantPrograms,
  getEmployeeAssistantProgramById,
  updateEmployeeAssistantProgram,
  deleteEmployeeAssistantProgram,

  // Leave
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,

  // Salary
  createSalary,
  getSalaries,
  getSalaryById,
  updateSalary,
  deleteSalary,
};