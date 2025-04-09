// services/salaryCalculator.js
const Employee = require("../models/Employee");
const TimeAndAttendance = require("../models/TimeAndAttendance");
const PayrollSystem = require("../models/PayrollSystem");

async function calculateMonthlySalary(employeeId, month, year) {
  try {
    // 1. Get employee data
    const employee = await Employee.findOne({ employeeId });
    if (!employee) throw new Error("Employee not found");

    // 2. Get payroll record
    let payroll = await PayrollSystem.findOne({ employeeId });
    if (!payroll) {
      payroll = new PayrollSystem({
        employeeId: employee.employeeId,
        name: `${employee.firstName} ${employee.lastName}`,
        department: employee.department,
        position: employee.position,
        email: employee.email,
        phone: employee.phone,
        baseSalary: employee.salary,
        hourlyRate: employee.salary / (22 * 8), // Assuming 22 working days/month, 8 hours/day
        hireDate: employee.hireDate,
        status: employee.status,
      });
    }

    // 3. Get attendance records for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await TimeAndAttendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    });

    // 4. Calculate worked hours
    let regularHours = 0;
    let overtimeHours = 0;
    const dailyRegularHours = 8; // Standard workday hours

    attendanceRecords.forEach((record) => {
      if (record.totalHours) {
        if (record.totalHours > dailyRegularHours) {
          regularHours += dailyRegularHours;
          overtimeHours += record.totalHours - dailyRegularHours;
        } else {
          regularHours += record.totalHours;
        }
      }
    });

    // 5. Calculate salary components
    const regularPay = regularHours * payroll.hourlyRate;
    const overtimePay =
      overtimeHours * payroll.hourlyRate * payroll.overtimeRate;
    const grossSalary = regularPay + overtimePay;

    // 6. Apply deductions (you can add more complex deduction logic)
    const deductions = calculateDeductions(grossSalary);
    const netSalary = grossSalary - deductions;

    // 7. Update or create monthly payroll record
    const existingRecordIndex = payroll.monthlyRecords.findIndex(
      (r) => r.month === month && r.year === year
    );

    const monthlyRecord = {
      month,
      year,
      regularHours,
      overtimeHours,
      totalSalary: grossSalary,
      deductions,
      netSalary,
      status: "Pending",
    };

    if (existingRecordIndex >= 0) {
      payroll.monthlyRecords[existingRecordIndex] = monthlyRecord;
    } else {
      payroll.monthlyRecords.push(monthlyRecord);
    }

    await payroll.save();
    return payroll;
  } catch (error) {
    console.error("Error calculating salary:", error);
    throw error;
  }
}

function calculateDeductions(grossSalary) {
  // Simple example - implement your actual deduction logic
  const taxRate = 0.15; // 15% tax
  const healthInsurance = 500; // Fixed amount
  return grossSalary * taxRate + healthInsurance;
}

module.exports = { calculateMonthlySalary };
  