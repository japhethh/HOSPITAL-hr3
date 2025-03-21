import { useEffect, useState } from "react";
import DataTable from "datatables.net-dt";
import PayrollSystemItem from "../Components/PayrollSystemItem";
import axios from "axios";
import { apiURL } from "../context/Store";
import { toast } from "react-toastify";

const EmployeeAssistantProgram = () => {
  const [assistantData, setAssistantData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // New state for edit modal
  const [newAssistantData, setNewAssistantData] = useState({
    employeeId: "",
    programName: "",
    startDate: "",
    endDate: "",
    status: "Active",
    remarks: "",
  });

  // Fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/api/employee-assistant-programs`
      );
      console.log(response.data);
      setAssistantData(response.data);
    } catch (error) {
      console.log(error?.response.data.message);
    }
  };

  // Sample data for employee assistant programs
  const data = [
    {
      employeeId: "EMP001",
      programName: "Health Wellness Program",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      status: "Active",
      remarks: "Promotes healthy lifestyle",
    },
    {
      employeeId: "EMP002",
      programName: "Career Development Program",
      startDate: "2023-02-01",
      endDate: "2023-11-30",
      status: "Active",
      remarks: "Enhances career skills",
    },
    {
      employeeId: "EMP003",
      programName: "Mental Health Support Program",
      startDate: "2023-03-01",
      endDate: "2023-10-31",
      status: "Active",
      remarks: "Provides mental health support",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssistantData({
      ...newAssistantData,
      [name]: value,
    });
  };

  const handleCreateAssistantProgram = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/api/employee-assistant-programs/`,
        newAssistantData
      );

      fetchData();
      toast.success("Created Successfully!");
      setCreateModalOpen(false);
      setNewAssistantData({
        employeeId: "",
        programName: "",
        startDate: "",
        endDate: "",
        status: "Active",
        remarks: "",
      });
    } catch (error) {
      console.log(error?.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${apiURL}/api/employee-assistant-programs/${selectedData._id}`
      );

      toast.info("Deleted Successfully!");

      fetchData();
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to update payroll");
    }
  };

  // Function to handle edit button click
  const handleEditClick = (data) => {
    setSelectedData(data);
    setNewAssistantData(data); // Pre-fill the form with selected data
    setEditModalOpen(true); // Open the edit modal
  };

  // Function to handle update assistant program
  const handleUpdateAssistantProgram = async () => {
    try {
      const response = await axios.put(
        `${apiURL}/api/employee-assistant-programs/${selectedData._id}`,
        selectedData
      );

      fetchData();
      toast.success("Update successfully");

      // Update the local state if needed

      setShowModal(false);
      setSelectedData(null);

      setEditModalOpen(false); // Close the edit modal
      setSelectedData(null); // Reset selected data
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to update payroll");
    }
  };

  useEffect(() => {
    const table = new DataTable("#myTable", {
      data: assistantData,
      columns: [
        {
          title: "Employee ID",
          data: "employeeId",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Program Name",
          data: "programName",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Start Date",
          data: "startDate",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "End Date",
          data: "endDate",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Status",
          data: "status",
          render: (data) => `${data ? data : "N/A"}`,
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
  }, [assistantData]);

  return (
    <div className="p-4">
      <PayrollSystemItem />

      <div className="flex justify-end items-center">
        <button
          className="bg-blue-500 py-2 px-4 rounded-md text-white font-semibold hover:bg-blue-400"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Assistant Program
        </button>
      </div>
      <div className="overflow-x-auto">
        <table id="myTable" className="display w-full"></table>
      </div>

      {/* Create Assistant Program Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">
              Create Assistant Program
            </h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newAssistantData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="programName"
                placeholder="Program Name"
                value={newAssistantData.programName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="startDate"
                placeholder="Start Date"
                value={newAssistantData.startDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="endDate"
                placeholder="End Date"
                value={newAssistantData.endDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newAssistantData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input
                type="text"
                name="remarks"
                placeholder="Remarks"
                value={newAssistantData.remarks}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => {
                  handleCreateAssistantProgram();
                  setCreateModalOpen(false);
                }}
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

      {/* Edit Assistant Program Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">
              Edit Assistant Program
            </h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newAssistantData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled // Disable editing of Employee ID
              />
              <input
                type="text"
                name="programName"
                placeholder="Program Name"
                value={newAssistantData.programName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="startDate"
                placeholder="Start Date"
                value={newAssistantData.startDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="endDate"
                placeholder="End Date"
                value={newAssistantData.endDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newAssistantData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input
                type="text"
                name="remarks"
                placeholder="Remarks"
                value={newAssistantData.remarks}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => {
                  handleUpdateAssistantProgram();
                  setEditModalOpen(false);
                  setNewAssistantData({
                    employeeId: "",
                    programName: "",
                    startDate: "",
                    endDate: "",
                    status: "Active",
                    remarks: "",
                  });
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setNewAssistantData({
                    employeeId: "",
                    programName: "",
                    startDate: "",
                    endDate: "",
                    status: "Active",
                    remarks: "",
                  });
                  setEditModalOpen(false);
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
            <h3 className="text-lg font-bold font-Roboto">
              Delete Assistant Program
            </h3>
            <p className="py-4 font-Roboto">
              Are you sure you want to{" "}
              <span className="text-red-500 font-bold font-Roboto">delete</span>{" "}
              the assistant program for{" "}
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
              Assistant Program Details
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
                    <label htmlFor="programName" className="label">
                      Program Name
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.programName}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="startDate" className="label">
                      Start Date
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.startDate}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="endDate" className="label">
                      End Date
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.endDate}
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

export default EmployeeAssistantProgram;
