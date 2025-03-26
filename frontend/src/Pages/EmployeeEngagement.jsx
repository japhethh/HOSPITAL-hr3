import { useEffect, useState } from "react";
import DataTable from "datatables.net-dt";
import PayrollSystemItem from "../Components/PayrollSystemItem";
import axios from "axios";
import { apiURL } from "../context/Store";
import { toast } from "react-toastify";

const EmployeeEngagement = () => {
  const [engagementData, setEngagementData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newEngagementData, setNewEngagementData] = useState({
    employeeId: "",
    engagementType: "Survey",
    engagementDate: "",
    engagementDetails: "",
    facilitator: "",
    status: "Pending",
    outcome: "Neutral",
    remarks: "",
  });

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/employee-engagements`);
      console.log(response.data);
      setEngagementData(response.data);
    } catch (error) {
      console.log(error?.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEngagementData({
      ...newEngagementData,
      [name]: value,
    });
  };

  const handleCreateEngagement = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/api/employee-engagements/`,
        newEngagementData
      );

      fetchData();
      toast.success("Created Successfully!");
      setCreateModalOpen(false);
      setNewEngagementData({
        employeeId: "",
        engagementType: "Survey",
        engagementDate: "",
        engagementDetails: "",
        facilitator: "",
        status: "Pending",
        outcome: "Neutral",
        remarks: "",
      });
    } catch (error) {
      console.log(error?.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${apiURL}/api/employee-engagements/${selectedData._id}`
      );

      toast.info("Deleted Successfully!");
      fetchData();
      setShowModal(false);
      setSelectedData(null);
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to delete engagement.");
    }
  };

  // Function to handle edit button click
  const handleEditClick = (data) => {
    setSelectedData(data);
    setNewEngagementData(data); // Pre-fill the form with selected data
    setEditModalOpen(true); // Open the edit modal
  };

  // Function to handle update engagement
  const handleUpdateEngagement = async () => {
    try {
      const response = await axios.put(
        `${apiURL}/api/employee-engagements/${selectedData._id}`,
        newEngagementData // Use newEngagementData instead of selectedData
      );

      fetchData();
      toast.success("Updated Successfully");

      setEditModalOpen(false); // Close the edit modal
      setSelectedData(null); // Reset selected data
      setNewEngagementData({
        employeeId: "",
        engagementType: "Survey",
        engagementDate: "",
        engagementDetails: "",
        facilitator: "",
        status: "Pending",
        outcome: "Neutral",
        remarks: "",
      }); // Reset the form
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to update engagement.");
    }
  };

  useEffect(() => {
    const table = new DataTable("#myTable", {
      data: engagementData,
      columns: [
        {
          title: "Employee ID",
          data: "employeeId",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Engagement Type",
          data: "engagementType",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Engagement Date",
          data: "engagementDate",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Facilitator",
          data: "facilitator",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Status",
          data: "status",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Outcome",
          data: "outcome",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Action",
          data: null,
          render: (data) => {
            return `
             <div class="flex items-center justify-center space-x-2">
              <button 
                class="group relative inline-flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-red-50 hover:bg-red-100 transition-all duration-300 ease-in-out" 
                id="deleteBtn_${data?.employeeId}"
                title="Delete"
              >
                <span class="text-red-500 transition-colors duration-300 ease-in-out group-hover:text-red-600">
                  <i class="fas fa-trash-alt text-sm"></i>
                </span>
                <div class="absolute inset-0 border-2 border-red-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>
              
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
  }, [engagementData]);

  return (
    <div className="p-4">
      <PayrollSystemItem
        data={engagementData}
        title={"Employee Engagement Data"}
      />

      <div className="flex justify-end items-center">
        <button
          className="bg-blue-500 py-2 px-4 rounded-md text-white font-semibold hover:bg-blue-400"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Engagement
        </button>
      </div>
      <div className="overflow-x-auto">
        <table id="myTable" className="display">
          <thead className="bg-blue-500 text-white"></thead>
        </table>
      </div>

      {/* Create Engagement Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Create Engagement</h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newEngagementData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="engagementType"
                value={newEngagementData.engagementType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Survey">Survey</option>
                <option value="Feedback Session">Feedback Session</option>
                <option value="Team Building">Team Building</option>
                <option value="Training">Training</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                name="engagementDate"
                placeholder="Engagement Date"
                value={newEngagementData.engagementDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="engagementDetails"
                placeholder="Engagement Details"
                value={newEngagementData.engagementDetails}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="facilitator"
                placeholder="Facilitator"
                value={newEngagementData.facilitator}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newEngagementData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                name="outcome"
                value={newEngagementData.outcome}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
              </select>
              <input
                type="text"
                name="remarks"
                placeholder="Remarks"
                value={newEngagementData.remarks}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleCreateEngagement}
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

      {/* Edit Engagement Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Edit Engagement</h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newEngagementData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled // Disable editing of Employee ID
              />
              <select
                name="engagementType"
                value={newEngagementData.engagementType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Survey">Survey</option>
                <option value="Feedback Session">Feedback Session</option>
                <option value="Team Building">Team Building</option>
                <option value="Training">Training</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                name="engagementDate"
                placeholder="Engagement Date"
                value={newEngagementData.engagementDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="engagementDetails"
                placeholder="Engagement Details"
                value={newEngagementData.engagementDetails}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="facilitator"
                placeholder="Facilitator"
                value={newEngagementData.facilitator}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newEngagementData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                name="outcome"
                value={newEngagementData.outcome}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
              </select>
              <input
                type="text"
                name="remarks"
                placeholder="Remarks"
                value={newEngagementData.remarks}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleUpdateEngagement}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setNewEngagementData({
                    employeeId: "",
                    engagementType: "Survey",
                    engagementDate: "",
                    engagementDetails: "",
                    facilitator: "",
                    status: "Pending",
                    outcome: "Neutral",
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
            <h3 className="text-lg font-bold font-Roboto">Delete Engagement</h3>
            <p className="py-4 font-Roboto">
              Are you sure you want to{" "}
              <span className="text-red-500 font-bold font-Roboto">delete</span>{" "}
              the engagement record for{" "}
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
              Engagement Details
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
                    {selectedData?.employeeId}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="engagementType" className="label">
                      Engagement Type
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.engagementType}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="engagementDate" className="label">
                      Engagement Date
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.engagementDate}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="facilitator" className="label">
                      Facilitator
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.facilitator}
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
                    <label htmlFor="outcome" className="label">
                      Outcome
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.outcome}
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

export default EmployeeEngagement;
