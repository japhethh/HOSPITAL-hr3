const Employee = require("../models/Employee");
const PayrollSystem = require("../models/PayrollSystem");
const TimeAndAttendance = require("../models/TimeAndAttendance");

// Helper function to calculate daily earnings
function calculateDailyEarnings(baseSalary, hoursWorked) {
  const workingDaysPerMonth = 22;
  const standardHoursPerDay = 8;

  const dailyRate = baseSalary / workingDaysPerMonth;
  const hourlyRate = dailyRate / standardHoursPerDay;

  const regularHours = Math.min(hoursWorked, standardHoursPerDay);
  const overtimeHours = Math.max(0, hoursWorked - standardHoursPerDay);

  return regularHours * hourlyRate + overtimeHours * hourlyRate * 1.5;
}

// Process payroll for all employees for a specific month
exports.processMonthlyPayroll = async (year, month) => {
  try {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);

    const employees = await Employee.find({});
    const results = [];

    for (const employee of employees) {
      const attendanceRecords = await TimeAndAttendance.find({
        employeeId: employee.employeeId,
        date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
        status: { $in: ["Completed", "Short Hours"] },
      });

      if (attendanceRecords.length === 0) {
        results.push({
          employeeId: employee.employeeId,
          status: "skipped",
          message: "No attendance records found",
        });
        continue;
      }

      // Calculate totals
      let totalHours = 0;
      let overtimeHours = 0;

      attendanceRecords.forEach((record) => {
        totalHours += record.totalHours || 0;
        overtimeHours += Math.max(0, (record.totalHours || 0) - 8);
      });

      // Calculate payroll
      const baseSalary = employee.baseSalary || 0;
      const dailyRate = baseSalary / 22;
      const hourlyRate = dailyRate / 8;

      const regularPay = (totalHours - overtimeHours) * hourlyRate;
      const overtimePay = overtimeHours * hourlyRate * 1.5;
      const grossPay = regularPay + overtimePay;
      const tax = grossPay * 0.1;
      const netPay = grossPay - tax;

      // Create/update payroll record
      const payroll = await PayrollSystem.findOneAndUpdate(
        {
          employeeId: employee.employeeId,
          payPeriodStart: firstDayOfMonth,
          payPeriodEnd: lastDayOfMonth,
        },
        {
          $set: {
            name: employee.name,
            department: employee.department,
            position: employee.position,
            baseSalary: baseSalary,
            items: attendanceRecords.map((record) => ({
              description: `Work on ${record.date.toLocaleDateString()}`,
              amount: calculateDailyEarnings(baseSalary, record.totalHours),
              type: "earning",
              hours: record.totalHours,
              date: record.date,
            })),
            totalEarnings: grossPay,
            totalDeductions: tax,
            netPay: netPay,
            status: "processed",
            hoursWorked: totalHours,
            overtimeHours: overtimeHours,
            leaveDays: 0,
          },
        },
        { upsert: true, new: true }
      );

      results.push({
        employeeId: employee.employeeId,
        status: "processed",
        payrollId: payroll._id,
        period: `${firstDayOfMonth.toISOString()} to ${lastDayOfMonth.toISOString()}`,
        netPay: netPay,
      });
    }

    return {
      success: true,
      message: "Monthly payroll processing completed",
      results: results,
    };
  } catch (error) {
    console.error("Error processing payroll:", error);
    return {
      success: false,
      message: "Failed to process payroll",
      error: error.message,
    };
  }
};

// Get all payroll records
exports.getAllPayrolls = async () => {
  try {
    const payrolls = await PayrollSystem.find().sort({ payPeriodStart: -1 });
    return { success: true, data: payrolls };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get payroll by ID
exports.getPayrollById = async (id) => {
  try {
    const payroll = await PayrollSystem.findById(id);
    if (!payroll) {
      return { success: false, message: "Payroll not found" };
    }
    return { success: true, data: payroll };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
