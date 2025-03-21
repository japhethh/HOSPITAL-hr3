import { useEffect, useState } from "react";
import DataTable from "datatables.net-dt";
import PayrollSystemItem from "../Components/PayrollSystemItem";
import axios from "axios";
import { apiURL } from "../context/Store";
import { toast } from "react-toastify";

const Leave = () => {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newLeaveData, setNewLeaveData] = useState({
    employeeId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    totalDays: 0,
    reason: "",
    status: "Pending",
    approver: "",
    appliedDate: new Date(),
    approvalDate: "",
    rejectionReason: "",
  });

  // const [leaveData, setLeaveData] = useState([]);
  // Fetch leave data from the API
  const data = [
    {
      _id: "1",
      employeeId: "EMP001",
      leaveType: "Sick Leave",
      startDate: "2023-10-01",
      endDate: "2023-10-03",
      totalDays: 3,
      reason: "High fever and flu",
      status: "Approved",
      approver: "HR001",
      appliedDate: "2023-09-30",
      approvalDate: "2023-09-30",
      rejectionReason: "",
    },
    {
      _id: "2",
      employeeId: "EMP002",
      leaveType: "Annual Leave",
      startDate: "2023-11-15",
      endDate: "2023-11-20",
      totalDays: 5,
      reason: "Vacation with family",
      status: "Pending",
      approver: "HR001",
      appliedDate: "2023-10-10",
      approvalDate: "",
      rejectionReason: "",
    },
    {
      _id: "3",
      employeeId: "EMP003",
      leaveType: "Maternity Leave",
      startDate: "2023-12-01",
      endDate: "2024-03-01",
      totalDays: 90,
      reason: "Maternity leave for childbirth",
      status: "Approved",
      approver: "HR002",
      appliedDate: "2023-11-20",
      approvalDate: "2023-11-21",
      rejectionReason: "",
    },
    {
      _id: "4",
      employeeId: "EMP004",
      leaveType: "Casual Leave",
      startDate: "2023-10-05",
      endDate: "2023-10-06",
      totalDays: 2,
      reason: "Personal work",
      status: "Rejected",
      approver: "HR001",
      appliedDate: "2023-10-04",
      approvalDate: "2023-10-04",
      rejectionReason: "Insufficient reason provided",
    },
    {
      _id: "5",
      employeeId: "EMP005",
      leaveType: "Paternity Leave",
      startDate: "2023-11-01",
      endDate: "2023-11-07",
      totalDays: 7,
      reason: "Paternity leave for newborn child",
      status: "Pending",
      approver: "HR002",
      appliedDate: "2023-10-25",
      approvalDate: "",
      rejectionReason: "",
    },
  ];

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/leave`);
        // setLeaveData(response.data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };
    fetchLeaveData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeaveData({
      ...newLeaveData,
      [name]: value,
    });
  };

  const handleCreateLeave = async () => {
    try {
      const response = await axios.post(`${apiURL}/api/leave`, newLeaveData);
      // setLeaveData([...leaveData, response.data]);
      toast.success("Leave created successfully!");
      setCreateModalOpen(false);
      setNewLeaveData({
        employeeId: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        totalDays: 0,
        reason: "",
        status: "Pending",
        approver: "",
        appliedDate: new Date(),
        approvalDate: "",
        rejectionReason: "",
      });
    } catch (error) {
      console.error("Error creating leave:", error);
      toast.error("Failed to create leave.");
    }
  };

  const handleDeleteLeave = async () => {
    try {
      await axios.delete(`${apiURL}/api/leave/${selectedLeave._id}`);
      // setLeaveData(
      //   leaveData.filter((leave) => leave._id !== selectedLeave._id)
      // );
      toast.success("Leave deleted successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting leave:", error);
      toast.error("Failed to delete leave.");
    }
  };

  const handleEditClick = (leave) => {
    setSelectedLeave(leave);
    setNewLeaveData(leave);
    setEditModalOpen(true);
  };

  const handleUpdateLeave = async () => {
    try {
      const response = await axios.put(
        `${apiURL}/api/leave/${selectedLeave._id}`,
        newLeaveData
      );
      // setLeaveData(
      //   leaveData.map((leave) =>
      //     leave._id === selectedLeave._id ? response.data : leave
      //   )
      // );
      toast.success("Leave updated successfully!");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating leave:", error);
      toast.error("Failed to update leave.");
    }
  };

  useEffect(() => {
    const table = new DataTable("#leaveTable", {
      data: data,
      columns: [
        { title: "Employee ID", data: "employeeId" },
        { title: "Leave Type", data: "leaveType" },
        { title: "Start Date", data: "startDate" },
        { title: "End Date", data: "endDate" },
        { title: "Total Days", data: "totalDays" },
        { title: "Status", data: "status" },
        { title: "Applied Date", data: "appliedDate" },
        { title: "Approval Date", data: "approvalDate" },
        // { title: "Approver", data: "approver" },
        // { title: "Reason", data: "reason" },
        // { title: "Rejection Reason", data: "rejectionReason" },
        {
          title: "Action",
          data: null,
          render: (data) => {
            return `
            <div>
              <button class="bg-red-500 text-xs text-white font-Roboto px-2 py-1 rounded-lg mx-1 cursor-pointer" id="deleteBtn_${data._id}">
                <i class="fas fa-trash-alt"></i>
              </button>
              <button class="bg-blue-700 text-xs text-white px-2 py-1 rounded-lg cursor-pointer" id="detailBtn_${data._id}">
                <i class="fas fa-eye"></i>
              </button>
              <button class="bg-green-500 text-xs text-white px-2 py-1 rounded-lg cursor-pointer" id="editBtn_${data._id}">
                <i class="fas fa-edit"></i>
              </button>
            </div>`;
          },
        },
      ],
      rowCallback: (row, data) => {
        const deleteBtn = row.querySelector(`#deleteBtn_${data._id}`);
        deleteBtn.addEventListener("click", () => {
          setSelectedLeave(data);
          setModalType("delete");
          setShowModal(true);
        });

        const detailBtn = row.querySelector(`#detailBtn_${data._id}`);
        if (detailBtn) {
          detailBtn.addEventListener("click", () => {
            setSelectedLeave(data);
            setModalType("detail");
            setShowModal(true);
          });
        }

        const editBtn = row.querySelector(`#editBtn_${data._id}`);
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
  }, [data]);

  return (
    <div className="p-4">
      <PayrollSystemItem />

      <div className="flex justify-end items-center">
        <button
          className="bg-blue-500 py-2 px-4 rounded-md text-white font-semibold hover:bg-blue-400"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Leave
        </button>
      </div>
      <div className="overflow-x-auto">
        <table id="leaveTable" className="display w-full"></table>
      </div>

      {/* Create Leave Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Create Leave</h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newLeaveData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="leaveType"
                value={newLeaveData.leaveType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
              </select>
              <input
                type="date"
                name="startDate"
                placeholder="Start Date"
                value={newLeaveData.startDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="endDate"
                placeholder="End Date"
                value={newLeaveData.endDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="totalDays"
                placeholder="Total Days"
                value={newLeaveData.totalDays}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="reason"
                placeholder="Reason"
                value={newLeaveData.reason}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newLeaveData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input
                type="text"
                name="approver"
                placeholder="Approver"
                value={newLeaveData.approver}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleCreateLeave}
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

      {/* Edit Leave Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Edit Leave</h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newLeaveData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled
              />
              <select
                name="leaveType"
                value={newLeaveData.leaveType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
              </select>
              <input
                type="date"
                name="startDate"
                placeholder="Start Date"
                value={newLeaveData.startDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="endDate"
                placeholder="End Date"
                value={newLeaveData.endDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="totalDays"
                placeholder="Total Days"
                value={newLeaveData.totalDays}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="reason"
                placeholder="Reason"
                value={newLeaveData.reason}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newLeaveData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input
                type="text"
                name="approver"
                placeholder="Approver"
                value={newLeaveData.approver}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleUpdateLeave}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
              <button
                onClick={() => setEditModalOpen(false)}
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
            <h3 className="text-lg font-bold font-Roboto">Delete Leave</h3>
            <p className="py-4 font-Roboto">
              Are you sure you want to{" "}
              <span className="text-red-500 font-bold font-Roboto">delete</span>{" "}
              this leave record?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteLeave}
                className="btn btn-error btn-md text-white font-Roboto"
              >
                Confirm
              </button>
              <button
                className="btn btn-outline btn-error btn-md text-white font-Roboto"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && modalType === "detail" && selectedLeave && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg overflow-hidden">
            <h1 className="text-xl font-semibold py-2 font-Roboto text-gray-800">
              Leave Details
            </h1>
            <div className="overflow-y-scroll h-72 ">
              <div className="space-y-3 ">
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="employeeId" className="label">
                      Employee ID
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedLeave.employeeId}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="leaveType" className="label">
                      Leave Type
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedLeave.leaveType}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="startDate" className="label">
                      Start Date
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedLeave.startDate}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="endDate" className="label">
                      End Date
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedLeave.endDate}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="totalDays" className="label">
                      Total Days
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedLeave.totalDays}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="reason" className="label">
                      Reason
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedLeave.reason}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="status" className="label">
                      Status
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedLeave.status}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="approver" className="label">
                      Approver
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedLeave.approver}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="appliedDate" className="label">
                      Applied Date
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedLeave.appliedDate}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="approvalDate" className="label">
                      Approval Date
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedLeave.approvalDate}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="rejectionReason" className="label">
                      Rejection Reason
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedLeave.rejectionReason}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-Roboto hover:opacity-80 transition"
                onClick={() => setShowModal(false)}
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

export default Leave;
