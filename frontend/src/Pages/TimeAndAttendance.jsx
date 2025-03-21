import { useEffect, useState } from "react";
import DataTable from "datatables.net-dt";
import PayrollSystemItem from "../Components/PayrollSystemItem";
import axios from "axios";
import { apiURL } from "../context/Store";
import { toast } from "react-toastify";

const TimeAndAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // State for edit modal
  const [newAttendanceData, setNewAttendanceData] = useState({
    employeeId: "",
    date: "",
    clockIn: "",
    clockOut: "",
    totalHours: 0,
    status: "Present",
    remarks: "",
  });

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/time-and-attendances`);
      console.log(response.data);
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

  // Function to handle edit button click
  const handleEditClick = (data) => {
    setSelectedData(data);
    setNewAttendanceData(data); // Pre-fill the form with selected data
    setEditModalOpen(true); // Open the edit modal
  };

  // Function to handle update attendance
  const handleUpdateAttendance = async () => {
    try {
      const response = await axios.put(
        `${apiURL}/api/time-and-attendances/${selectedData._id}`,
        newAttendanceData
      );

      fetchData();
      toast.success("Attendance updated successfully!");
      setEditModalOpen(false); // Close the edit modal
      setSelectedData(null); // Reset selected data
      setNewAttendanceData({
        employeeId: "",
        date: "",
        clockIn: "",
        clockOut: "",
        totalHours: 0,
        status: "Present",
        remarks: "",
      }); // Reset the form
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to update attendance.");
    }
  };

  useEffect(() => {
    const table = new DataTable("#myTable", {
      data: attendanceData,
      columns: [
        { title: "Employee ID", data: "employeeId" },
        {
          title: "Date",
          data: "date",
          render: (data) =>
            `${
              new Date(data).toLocaleString()
                ? new Date(data).toLocaleString()
                : "N/A"
            }`,
        },
        { title: "Clock In", data: "clockIn" },
        { title: "Clock Out", data: "clockOut" },
        { title: "Total Hours", data: "totalHours" },
        { title: "Status", data: "status" },
        { title: "Remarks", data: "remarks" },
        {
          title: "Action",
          data: null,
          render: (data) => {
            return `
            <div>
              <button class="bg-red-500 text-xs text-white font-Roboto px-2 py-1 rounded-lg mx-1 cursor-pointer" id="deleteBtn_${data?.employeeId}">
                <i class="fas fa-trash-alt"></i>
              </button>
              <button class="bg-blue-700 text-xs text-white px-2 py-1 rounded-lg cursor-pointer" id="detailBtn_${data.employeeId}">
                <i class="fas fa-eye"></i>
              </button>
              <button class="bg-green-500 text-xs text-white px-2 py-1 rounded-lg cursor-pointer" id="editBtn_${data.employeeId}">
                <i class="fas fa-edit"></i>
              </button>
            </div>`;
          },
        },
      ],
      rowCallback: (row, data) => {
        const deleteBtn = row.querySelector(`#deleteBtn_${data?.employeeId}`);
        deleteBtn.addEventListener("click", () => {
          setSelectedData(data);
          setModalType("delete");
          setShowModal(true);
        });

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
            handleEditClick(data); // Open edit modal with selected data
          });
        }
      },
      responsive: true,
      destroy: true,
    });

    return () => {
      table.destroy();
    };
  }, [attendanceData]);

  return (
    <div className="p-4">
      <PayrollSystemItem />

      <div className="flex justify-end items-center">
        <button
          className="bg-blue-500 py-2 px-4 rounded-md text-white font-semibold hover:bg-blue-400"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Attendance
        </button>
      </div>
      <div className="overflow-x-auto">
        <table id="myTable" className="display w-full"></table>
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
                disabled // Disable editing of Employee ID
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