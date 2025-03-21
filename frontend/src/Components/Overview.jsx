import { useEffect, useState } from "react";
import axios from "axios";
import { apiURL } from "../context/Store";
import { toast } from "react-toastify";

const OverView = () => {
  const [employeeCount, setEmployeeCount] = useState(10);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(899);
  const [pendingSalaryCount, setPendingSalaryCount] = useState(623);

  // Mock data for leave requests
  const mockLeaveRequests = [
    {
      _id: "1",
      employeeId: "EMP001",
      leaveType: "Sick Leave",
      startDate: "2023-10-01",
      endDate: "2023-10-03",
      status: "Pending",
    },
    {
      _id: "2",
      employeeId: "EMP002",
      leaveType: "Annual Leave",
      startDate: "2023-11-15",
      endDate: "2023-11-20",
      status: "Approved",
    },
    {
      _id: "3",
      employeeId: "EMP003",
      leaveType: "Maternity Leave",
      startDate: "2023-12-01",
      endDate: "2024-03-01",
      status: "Pending",
    },
    {
      _id: "4",
      employeeId: "EMP004",
      leaveType: "Casual Leave",
      startDate: "2023-10-05",
      endDate: "2023-10-06",
      status: "Rejected",
    },
    {
      _id: "5",
      employeeId: "EMP005",
      leaveType: "Paternity Leave",
      startDate: "2023-11-01",
      endDate: "2023-11-07",
      status: "Pending",
    },
  ];

  // Mock data for salary records
  const mockSalaryRecords = [
    {
      _id: "1",
      employeeId: "EMP001",
      basicSalary: 50000,
      allowances: 10000,
      deductions: 5000,
      netSalary: 55000,
      status: "Paid",
    },
    {
      _id: "2",
      employeeId: "EMP002",
      basicSalary: 60000,
      allowances: 12000,
      deductions: 6000,
      netSalary: 66000,
      status: "Pending",
    },
    {
      _id: "3",
      employeeId: "EMP003",
      basicSalary: 70000,
      allowances: 15000,
      deductions: 7000,
      netSalary: 78000,
      status: "Paid",
    },
    {
      _id: "4",
      employeeId: "EMP004",
      basicSalary: 55000,
      allowances: 11000,
      deductions: 5500,
      netSalary: 60500,
      status: "Pending",
    },
    {
      _id: "5",
      employeeId: "EMP005",
      basicSalary: 65000,
      allowances: 13000,
      deductions: 6500,
      netSalary: 71500,
      status: "Cancelled",
    },
  ];

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch employee count
        const employeeResponse = await axios.get(
          `${apiURL}/api/employees/count`
        );
        setEmployeeCount(employeeResponse.data.count);

        // Fetch leave requests
        const leaveResponse = await axios.get(`${apiURL}/api/leave`);
        setLeaveRequests(leaveResponse.data);
        setPendingLeaveCount(
          leaveResponse.data.filter((leave) => leave.status === "Pending")
            .length
        );

        // Fetch salary records
        const salaryResponse = await axios.get(`${apiURL}/api/salary`);
        setSalaryRecords(salaryResponse.data);
        setPendingSalaryCount(
          salaryResponse.data.filter((salary) => salary.status === "Pending")
            .length
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data.");

        // Use mock data if API fails
        setLeaveRequests(mockLeaveRequests);
        setSalaryRecords(mockSalaryRecords);
        setPendingLeaveCount(
          mockLeaveRequests.filter((leave) => leave.status === "Pending").length
        );
        setPendingSalaryCount(
          mockSalaryRecords.filter((salary) => salary.status === "Pending")
            .length
        );
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Hospital Management System Dashboard
      </h1>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Employee Count Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Employees
          </h2>
          <p className="text-3xl font-bold text-blue-600">{employeeCount}</p>
        </div>

        {/* Pending Leave Requests Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Pending Leave Requests
          </h2>
          <p className="text-3xl font-bold text-yellow-600">
            {pendingLeaveCount}
          </p>
        </div>

        {/* Pending Salary Records Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Pending Salary Records
          </h2>
          <p className="text-3xl font-bold text-red-600">
            {pendingSalaryCount}
          </p>
        </div>

        {/* Total Salary Paid Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Salary Paid
          </h2>
          <p className="text-3xl font-bold text-green-600">
            $
            {salaryRecords.reduce(
              (total, salary) =>
                total + (salary.status === "Paid" ? salary.netSalary : 0),
              0
            )}
          </p>
        </div>
      </div>

      {/* Recent Leave Requests Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Leave Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Employee ID</th>
                <th className="py-2 px-4 border-b">Leave Type</th>
                <th className="py-2 px-4 border-b">Start Date</th>
                <th className="py-2 px-4 border-b">End Date</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.slice(0, 5).map((leave) => (
                <tr key={leave._id}>
                  <td className="py-2 px-4 border-b text-center">
                    {leave.employeeId}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {leave.leaveType}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {leave.startDate}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {leave.endDate}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : leave.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Salary Records Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Salary Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Employee ID</th>
                <th className="py-2 px-4 border-b">Basic Salary</th>
                <th className="py-2 px-4 border-b">Allowances</th>
                <th className="py-2 px-4 border-b">Deductions</th>
                <th className="py-2 px-4 border-b">Net Salary</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {salaryRecords.slice(0, 5).map((salary) => (
                <tr key={salary._id}>
                  <td className="py-2 px-4 border-b text-center">
                    {salary.employeeId}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    ${salary.basicSalary}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    ${salary.allowances}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    ${salary.deductions}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    ${salary.netSalary}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        salary.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : salary.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {salary.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverView;
