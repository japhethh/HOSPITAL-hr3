import { useEffect, useState } from "react";
import axios from "axios";
import { apiURL } from "../context/Store";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const OverView = () => {
  const [employeeCount, setEmployeeCount] = useState(10);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(899);
  const [pendingSalaryCount, setPendingSalaryCount] = useState(623);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartData, setChartData] = useState({
    leaveStatus: {},
    salaryStatus: {},
    monthlySalaryData: {},
  });

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

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

        // Process data for charts
        const leaveStatusCount = leaveResponse.data.reduce((acc, leave) => {
          acc[leave.status] = (acc[leave.status] || 0) + 1;
          return acc;
        }, {});

        const salaryStatusCount = salaryResponse.data.reduce((acc, salary) => {
          acc[salary.status] = (acc[salary.status] || 0) + 1;
          return acc;
        }, {});

        // Mock monthly salary data (in a real app, you'd get this from your API)
        const monthlySalaryData = {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          paid: [50000, 55000, 60000, 58000, 62000, 65000],
          pending: [10000, 12000, 8000, 15000, 9000, 11000],
        };

        setChartData({
          leaveStatus: leaveStatusCount,
          salaryStatus: salaryStatusCount,
          monthlySalaryData,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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

        // Process mock data for charts
        const leaveStatusCount = mockLeaveRequests.reduce((acc, leave) => {
          acc[leave.status] = (acc[leave.status] || 0) + 1;
          return acc;
        }, {});

        const salaryStatusCount = mockSalaryRecords.reduce((acc, salary) => {
          acc[salary.status] = (acc[salary.status] || 0) + 1;
          return acc;
        }, {});

        const monthlySalaryData = {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          paid: [50000, 55000, 60000, 58000, 62000, 65000],
          pending: [10000, 12000, 8000, 15000, 9000, 11000],
        };

        setChartData({
          leaveStatus: leaveStatusCount,
          salaryStatus: salaryStatusCount,
          monthlySalaryData,
        });
      }
    };

    fetchDashboardData();
  }, []);

  // Chart configurations
  const leaveStatusChart = {
    labels: Object.keys(chartData.leaveStatus || {}),
    datasets: [
      {
        label: "Leave Requests",
        data: Object.values(chartData.leaveStatus || {}),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const salaryStatusChart = {
    labels: Object.keys(chartData.salaryStatus || {}),
    datasets: [
      {
        label: "Salary Records",
        data: Object.values(chartData.salaryStatus || {}),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlySalaryTrendsChart = {
    labels: chartData.monthlySalaryData.labels || [],
    datasets: [
      {
        label: "Paid Salaries",
        data: chartData.monthlySalaryData.paid || [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
        fill: true,
      },
      {
        label: "Pending Salaries",
        data: chartData.monthlySalaryData.pending || [],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

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
            ₱
            {salaryRecords.reduce(
              (total, salary) =>
                total + (salary.status === "Paid" ? salary.netSalary : 0),
              0
            )}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Leave Status Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Leave Request Status</h2>
          <div className="h-64">
            <Pie
              data={leaveStatusChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Salary Status Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Salary Record Status</h2>
          <div className="h-64">
            <Pie
              data={salaryStatusChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Monthly Salary Trends Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Monthly Salary Trends</h2>
          <div className="h-64">
            <Line
              data={monthlySalaryTrendsChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Leave Types Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Leave Types Distribution</h2>
          <div className="h-64">
            <Bar
              data={{
                labels: leaveRequests.map((leave) => leave.leaveType),
                datasets: [
                  {
                    label: "Leave Duration (Days)",
                    data: leaveRequests.map((leave) => {
                      const start = new Date(leave.startDate);
                      const end = new Date(leave.endDate);
                      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                    }),
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Duration (Days)",
                    },
                  },
                },
              }}
            />
          </div>
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
                    ₱{salary.basicSalary}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    ₱{salary.allowances}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    ₱{salary.deductions}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    ₱{salary.netSalary}
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
