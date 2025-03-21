const {
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
  } = require("../service/hrService");
  
  // Employee Controllers
  const createEmployeeController = async (req, res) => {
    try {
      const employee = await createEmployee(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getEmployeesController = async (req, res) => {
    try {
      const employees = await getEmployees();
      res.status(200).json(employees);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getEmployeeByIdController = async (req, res) => {
    try {
      const employee = await getEmployeeById(req.params.id);
      res.status(200).json(employee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const updateEmployeeController = async (req, res) => {
    try {
      const employee = await updateEmployee(req.params.id, req.body);
      res.status(200).json(employee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const deleteEmployeeController = async (req, res) => {
    try {
      await deleteEmployee(req.params.id);
      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // EmployeeEngagement Controllers
  const createEmployeeEngagementController = async (req, res) => {
    try {
      const engagement = await createEmployeeEngagement(req.body);
      res.status(201).json(engagement);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getEmployeeEngagementsController = async (req, res) => {
    try {
      const engagements = await getEmployeeEngagements();
      res.status(200).json(engagements);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getEmployeeEngagementByIdController = async (req, res) => {
    try {
      const engagement = await getEmployeeEngagementById(req.params.id);
      res.status(200).json(engagement);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const updateEmployeeEngagementController = async (req, res) => {
    try {
      const engagement = await updateEmployeeEngagement(req.params.id, req.body);
      res.status(200).json(engagement);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const deleteEmployeeEngagementController = async (req, res) => {
    try {
      await deleteEmployeeEngagement(req.params.id);
      res.status(200).json({ message: "Employee engagement deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // PayrollSystem Controllers
  const createPayrollSystemController = async (req, res) => {
    try {
      const payroll = await createPayrollSystem(req.body);
      res.status(201).json(payroll);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getPayrollSystemsController = async (req, res) => {
    try {
      const payrolls = await getPayrollSystems();
      res.status(200).json(payrolls);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getPayrollSystemByIdController = async (req, res) => {
    try {
      const payroll = await getPayrollSystemById(req.params.id);
      res.status(200).json(payroll);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const updatePayrollSystemController = async (req, res) => {
    try {
      const payroll = await updatePayrollSystem(req.params.id, req.body);
      res.status(200).json(payroll);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const deletePayrollSystemController = async (req, res) => {
    try {
      await deletePayrollSystem(req.params.id);
      res.status(200).json({ message: "Payroll system deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // TimeAndAttendance Controllers
  const createTimeAndAttendanceController = async (req, res) => {
    try {
      const attendance = await createTimeAndAttendance(req.body);
      res.status(201).json(attendance);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getTimeAndAttendancesController = async (req, res) => {
    try {
      const attendances = await getTimeAndAttendances();
      res.status(200).json(attendances);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getTimeAndAttendanceByIdController = async (req, res) => {
    try {
      const attendance = await getTimeAndAttendanceById(req.params.id);
      res.status(200).json(attendance);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const updateTimeAndAttendanceController = async (req, res) => {
    try {
      const attendance = await updateTimeAndAttendance(req.params.id, req.body);
      res.status(200).json(attendance);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const deleteTimeAndAttendanceController = async (req, res) => {
    try {
      await deleteTimeAndAttendance(req.params.id);
      res.status(200).json({ message: "Time and attendance record deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // EmployeeAssistantProgram Controllers
  const createEmployeeAssistantProgramController = async (req, res) => {
    try {
      const program = await createEmployeeAssistantProgram(req.body);
      res.status(201).json(program);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getEmployeeAssistantProgramsController = async (req, res) => {
    try {
      const programs = await getEmployeeAssistantPrograms();
      res.status(200).json(programs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getEmployeeAssistantProgramByIdController = async (req, res) => {
    try {
      const program = await getEmployeeAssistantProgramById(req.params.id);
      res.status(200).json(program);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const updateEmployeeAssistantProgramController = async (req, res) => {
    try {
      const program = await updateEmployeeAssistantProgram(req.params.id, req.body);
      res.status(200).json(program);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const deleteEmployeeAssistantProgramController = async (req, res) => {
    try {
      await deleteEmployeeAssistantProgram(req.params.id);
      res.status(200).json({ message: "Employee assistant program deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Leave Controllers
  const createLeaveController = async (req, res) => {
    try {
      const leave = await createLeave(req.body);
      res.status(201).json(leave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getLeavesController = async (req, res) => {
    try {
      const leaves = await getLeaves();
      res.status(200).json(leaves);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getLeaveByIdController = async (req, res) => {
    try {
      const leave = await getLeaveById(req.params.id);
      res.status(200).json(leave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const updateLeaveController = async (req, res) => {
    try {
      const leave = await updateLeave(req.params.id, req.body);
      res.status(200).json(leave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const deleteLeaveController = async (req, res) => {
    try {
      await deleteLeave(req.params.id);
      res.status(200).json({ message: "Leave record deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Salary Controllers
  const createSalaryController = async (req, res) => {
    try {
      const salary = await createSalary(req.body);
      res.status(201).json(salary);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getSalariesController = async (req, res) => {
    try {
      const salaries = await getSalaries();
      res.status(200).json(salaries);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getSalaryByIdController = async (req, res) => {
    try {
      const salary = await getSalaryById(req.params.id);
      res.status(200).json(salary);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const updateSalaryController = async (req, res) => {
    try {
      const salary = await updateSalary(req.params.id, req.body);
      res.status(200).json(salary);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const deleteSalaryController = async (req, res) => {
    try {
      await deleteSalary(req.params.id);
      res.status(200).json({ message: "Salary record deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  module.exports = {
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
  };