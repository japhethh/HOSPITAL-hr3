import { useEffect, useState } from "react";
import DataTable from "datatables.net-dt";
import PayrollSystemItem from "../Components/PayrollSystemItem";
import axios from "axios";
import { apiURL } from "../context/Store";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { AttendancePdfDocument } from "../Components/AttendancePdfDocument";
const TimeAndAttendance = ({ profile }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    employeeId: "",
    date: "",
    status: "",
    department: "",
    search: "",
  });

  const [newAttendanceData, setNewAttendanceData] = useState({
    employeeId: "",
    date: "",
    clockIn: "",
    clockOut: "",
    totalHours: 0,
    status: "Present",
    remarks: "",
    department: "",
  });

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [attendanceData, filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/time-and-attendances`);
      setAttendanceData(response.data);
    } catch (error) {
      console.log(error?.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendanceData({
      ...newAttendanceData,
      [name]: value,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = () => {
    let result = [...attendanceData];

    // Apply employee ID filter
    if (filters.employeeId) {
      result = result.filter((att) =>
        att.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())
      );
    }

    // Apply date filter
    if (filters.date) {
      result = result.filter(
        (att) =>
          new Date(att.date).toLocaleDateString() ===
          new Date(filters.date).toLocaleDateString()
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(
        (att) => att.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Apply department filter
    if (filters.department) {
      result = result.filter((att) =>
        att.department?.toLowerCase().includes(filters.department.toLowerCase())
      );
    }

    // Apply search filter (searches employee ID and remarks)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (att) =>
          att.employeeId.toLowerCase().includes(searchTerm) ||
          (att.remarks && att.remarks.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredData(result);
  };

  const resetFilters = () => {
    setFilters({
      employeeId: "",
      date: "",
      status: "",
      department: "",
      search: "",
    });
  };

  const getUniqueValues = (key) => {
    const unique = new Set();
    attendanceData.forEach((att) => {
      if (att[key]) {
        unique.add(att[key]);
      }
    });
    return Array.from(unique).sort();
  };

  const handleCreateAttendance = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/api/time-and-attendances/`,
        newAttendanceData
      );

      fetchData();
      toast.success("Attendance created successfully!");
      setCreateModalOpen(false);
      setNewAttendanceData({
        employeeId: "",
        date: "",
        clockIn: "",
        clockOut: "",
        totalHours: 0,
        status: "Present",
        remarks: "",
        department: "",
      });
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to create attendance.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${apiURL}/api/time-and-attendances/${selectedData?._id}`
      );

      toast.success("Attendance deleted successfully!");
      fetchData();
      setShowModal(false);
      setSelectedData(null);
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to delete attendance.");
    }
  };

  const handleEditClick = (data) => {
    setSelectedData(data);
    setNewAttendanceData(data);
    setEditModalOpen(true);
  };

  const handleUpdateAttendance = async () => {
    try {
      const response = await axios.put(
        `${apiURL}/api/time-and-attendances/${selectedData._id}`,
        newAttendanceData
      );

      fetchData();
      toast.success("Attendance updated successfully!");
      setEditModalOpen(false);
      setSelectedData(null);
      setNewAttendanceData({
        employeeId: "",
        date: "",
        clockIn: "",
        clockOut: "",
        totalHours: 0,
        status: "Present",
        remarks: "",
        department: "",
      });
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to update attendance.");
    }
  };

  useEffect(() => {
    const table = new DataTable("#myTable", {
      data: filteredData.length > 0 ? filteredData : attendanceData,
      columns: [
        {
          title: "Employee ID",
          data: "employeeId",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Date",
          data: "date",
          render: (data) =>
            data ? new Date(data).toLocaleDateString() : "N/A",
        },
        {
          title: "Clock In",
          data: "clockIn",
          render: (data) => {
            if (!data) return "N/A";

            const date = new Date(data);
            if (isNaN(date.getTime())) return "Invalid Date";

            // Format time (8:00:34 AM)
            const timeString = date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });

            // Format date (month/day/year)
            const dateString = date.toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            });

            return `${timeString}<br>${dateString}`;
          },
        },
        {
          title: "Clock Out",
          data: "clockOut",
          render: (data) => {
            if (!data) return "N/A";

            const date = new Date(data);
            if (isNaN(date.getTime())) return "Invalid Date";

            // Format time (8:00:34 AM)
            const timeString = date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });

            // Format date (month/day/year)
            const dateString = date.toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            });

            return `${timeString}<br>${dateString}`;
          },
        },
        {
          title: "Total Hours",
          data: "totalHours",
          render: (data) => data || "N/A",
        },
        { title: "Status", data: "status", render: (data) => data || "N/A" },
        {
          title: "Department",
          data: "department",
          render: (data) => data || "N/A",
        },
        {
          title: "Remarks",
          data: "remarks",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Action",
          data: null,
          render: (data) => {
            return `
             <div class="flex items-center justify-center space-x-2">
             ${
               profile?.role === "superAdmin" || profile.role === "admin"
                 ? `   <button 
                class="group relative inline-flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-red-50 hover:bg-red-100 transition-all duration-300 ease-in-out" 
                id="deleteBtn_${data?.employeeId}"
                title="Delete"
              >
                <span class="text-red-500 transition-colors duration-300 ease-in-out group-hover:text-red-600">
                  <i class="fas fa-trash-alt text-sm"></i>
                </span>
                <div class="absolute inset-0 border-2 border-red-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>`
                 : ""
             }
              <button 
                class="group relative inline-flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-blue-50 hover:bg-blue-100 transition-all duration-300 ease-in-out" 
                id="detailBtn_${data.employeeId}"
                title="View Details"
              >
                <span class="text-blue-700 transition-colors duration-300 ease-in-out group-hover:text-blue-800">
                  <i class="fas fa-eye text-sm"></i>
                </span>
                <div class="absolute inset-0 border-2 border-blue-700 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>
              <button 
                class="group relative inline-flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-green-50 hover:bg-green-100 transition-all duration-300 ease-in-out" 
                id="editBtn_${data.employeeId}"
                title="Edit"
              >
                <span class="text-green-500 transition-colors duration-300 ease-in-out group-hover:text-green-600">
                  <i class="fas fa-edit text-sm"></i>
                </span>
                <div class="absolute inset-0 border-2 border-green-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>
            </div>`;
          },
        },
      ],
      order: [[2, "desc"]],
      rowCallback: (row, data) => {
        if (profile?.role === "superAdmin" || profile?.role === "admin") {
          const deleteBtn = row.querySelector(`#deleteBtn_${data?.employeeId}`);
          deleteBtn.addEventListener("click", () => {
            setSelectedData(data);
            setModalType("delete");
            setShowModal(true);
          });
        }

        const detailBtn = row.querySelector(`#detailBtn_${data?.employeeId}`);
        if (detailBtn) {
          detailBtn.addEventListener("click", () => {
            setSelectedData(data);
            setModalType("detail");
            setShowModal(true);
          });
        }

        const editBtn = row.querySelector(`#editBtn_${data?.employeeId}`);
        if (editBtn) {
          editBtn.addEventListener("click", () => {
            handleEditClick(data);
          });
        }
      },
      responsive: true,
      destroy: true,
    });

    return () => {
      table.destroy();
    };
  }, [attendanceData, filteredData]);

  return (
    <div className="p-4">
      <div className="w-full justify-end flex items-center ">
        {/* PDF Export Button */}
        <div className="flex justify-end items-center gap-4 mb-4">
          <Link
            to="/dashboard/faceDetection"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Time In
          </Link>
          <PDFDownloadLink
            document={
              <AttendancePdfDocument
                attendanceData={
                  filteredData.length > 0 ? filteredData : attendanceData
                }
                filters={filters}
                title="Attendance Report"
              />
            }
            fileName="attendance_report.pdf"
          >
            {({ loading }) => (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition-colors"
                disabled={loading}
              >
                {loading ? "Preparing document..." : "Export to PDF"}
              </button>
            )}
          </PDFDownloadLink>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Attendance
          </button>
        </div>
      </div>
      <PayrollSystemItem
        data={attendanceData}
        title={"Time And Attendance Data"}
      />

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by ID or remarks"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Employee ID Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
              placeholder="Filter by Employee ID"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
              <option value="Disputed">Disputed</option>
              <option value="Half-Day">Half-Day</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Departments</option>
              {getUniqueValues("department").map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table id="myTable" className="display">
          <thead className="bg-blue-500 text-white"></thead>
        </table>
      </div>

      {/* Create Attendance Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Create Attendance</h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newAttendanceData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="date"
                placeholder="Date"
                value={newAttendanceData.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="time"
                name="clockIn"
                placeholder="Clock In"
                value={newAttendanceData.clockIn}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="time"
                name="clockOut"
                placeholder="Clock Out"
                value={newAttendanceData.clockOut}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="totalHours"
                placeholder="Total Hours"
                value={newAttendanceData.totalHours}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newAttendanceData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
                <option value="Half-Day">Half-Day</option>
              </select>
              <select
                name="department"
                value={newAttendanceData.department}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select department</option>
                <option value="Ambulance">Ambulance</option>
                <option value="ER">ER</option>
                <option value="ICU">ICU</option>
                <option value="General">General</option>
                <option value="Administration">Administration</option>
              </select>
              <input
                type="text"
                name="remarks"
                placeholder="Remarks"
                value={newAttendanceData.remarks}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleCreateAttendance}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Create
              </button>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Attendance Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Edit Attendance</h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newAttendanceData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled
              />
              <input
                type="date"
                name="date"
                placeholder="Date"
                value={newAttendanceData.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="time"
                name="clockIn"
                placeholder="Clock In"
                value={newAttendanceData.clockIn}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="time"
                name="clockOut"
                placeholder="Clock Out"
                value={newAttendanceData.clockOut}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="totalHours"
                placeholder="Total Hours"
                value={newAttendanceData.totalHours}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newAttendanceData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
                <option value="Half-Day">Half-Day</option>
              </select>
              <select
                name="department"
                value={newAttendanceData.department}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select department</option>
                <option value="Ambulance">Ambulance</option>
                <option value="ER">ER</option>
                <option value="ICU">ICU</option>
                <option value="General">General</option>
                <option value="Administration">Administration</option>
              </select>
              <input
                type="text"
                name="remarks"
                placeholder="Remarks"
                value={newAttendanceData.remarks}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleUpdateAttendance}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setNewAttendanceData({
                    employeeId: "",
                    date: "",
                    clockIn: "",
                    clockOut: "",
                    totalHours: 0,
                    status: "Present",
                    remarks: "",
                    department: "",
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showModal && modalType === "delete" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Delete Attendance</h3>
            <p className="py-4 font-Roboto">
              Are you sure you want to{" "}
              <span className="text-red-500 font-bold font-Roboto">delete</span>{" "}
              the attendance record for{" "}
              <span className="font-bold font-Roboto">
                {selectedData?.employeeId}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  handleDelete();
                  setSelectedData(null);
                  setShowModal(false);
                }}
                className="btn btn-error btn-md text-white font-Roboto"
              >
                Confirm
              </button>
              <button
                className="btn btn-outline btn-error btn-md text-white font-Roboto"
                onClick={() => {
                  setSelectedData(null);
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && modalType === "detail" && selectedData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg overflow-hidden">
            <h1 className="text-2xl font-semibold py-2 font-Roboto text-gray-800">
              Attendance Details
            </h1>
            <div className="overflow-y-scroll h-72 ">
              <div className="space-y-3">
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="employeeId" className="label">
                      Employee ID
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.employeeId}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="date" className="label">
                      Date
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.date}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="clockIn" className="label">
                      Clock In
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.clockIn}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="clockOut" className="label">
                      Clock Out
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.clockOut}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="totalHours" className="label">
                      Total Hours
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.totalHours}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="status" className="label">
                      Status
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.status}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="department" className="label">
                      Department
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.department || "N/A"}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="remarks" className="label">
                      Remarks
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.remarks}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-Roboto hover:opacity-80 transition"
                onClick={() => {
                  setSelectedData(null);
                  setShowModal(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeAndAttendance;
