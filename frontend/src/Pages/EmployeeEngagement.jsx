import { useEffect, useState } from "react";
import DataTable from "datatables.net-dt";
import PayrollSystemItem from "../Components/PayrollSystemItem";
import { toast } from "react-toastify";

// Static employee data
const employeeList = [
  {
    _id: "1",
    employeeId: "EMP001",
    name: "Dr. Sarah Johnson",
    department: "Cardiology",
  },
  {
    _id: "2",
    employeeId: "EMP045",
    name: "Martin Rivera",
    department: "Emergency",
  },
  {
    _id: "3",
    employeeId: "EMP002",
    name: "HARVEY RONOLO",
    department: "Pediatrics",
  },
  {
    _id: "4",
    employeeId: "EMP003",
    name: "Melvin Abat",
    department: "Surgery",
  },
  {
    _id: "5",
    employeeId: "EMP004",
    name: "Jayvee abat",
    department: "Oncology",
  },
  {
    _id: "6",
    employeeId: "EMP005",
    name: "Ren Asum",
    department: "Radiology",
  },
];

// Static engagement data
const staticEngagementData = [
  {
    _id: "67ddaf48a70063ad66685683",
    employeeId: "EMP001",
    employeeName: "Dr. Sarah Johnson",
    department: "Cardiology",
    engagementType: "Training",
    engagementDate: "2025-03-26T00:00:00.000Z",
    engagementDetails: "Advanced Cardiac Life Support Certification",
    facilitator: "Medical Education Dept",
    status: "Completed",
    outcome: "Positive",
    impactScore: 4,
    followUpRequired: false,
    remarks: "Certification renewed successfully",
  },
  {
    _id: "67ddc19f6c7de51a8e745de3",
    employeeId: "EMP045",
    employeeName: "HARVEY RONOLO",
    department: "Emergency",
    engagementType: "Team Building",
    engagementDate: "2025-03-19T00:00:00.000Z",
    engagementDetails: "Interdepartmental Collaboration Workshop",
    facilitator: "HR Team",
    status: "Completed",
    outcome: "Excellent",
    impactScore: 5,
    followUpRequired: true,
    remarks: "Improved ER-to-ICU handoff procedures",
  },
  {
    _id: "67f0933c268533aa55c9ec35",
    employeeId: "EMP045",
    employeeName: "Nurse Mark Williams",
    department: "Emergency",
    engagementType: "Team Building",
    engagementDate: "2023-10-15T00:00:00.000Z",
    engagementDetails: "Quarterly Team Outing",
    facilitator: "Management Team",
    status: "Completed",
    outcome: "Excellent",
    impactScore: 4,
    followUpRequired: false,
    remarks: "Improved team collaboration and morale",
  },
  {
    _id: "67f0934b268533aa55c9ec37",
    employeeId: "EMP002",
    employeeName: "Dr. Lisa Chen",
    department: "Pediatrics",
    engagementType: "Training",
    engagementDate: "2023-09-20T00:00:00.000Z",
    engagementDetails: "Pediatric Advanced Life Support",
    facilitator: "Training Department",
    status: "Completed",
    outcome: "Positive",
    impactScore: 5,
    followUpRequired: false,
    remarks: "Certified with perfect score",
  },
  {
    _id: "67f09355268533aa55c9ec39",
    employeeId: "EMP003",
    employeeName: "Dr. Robert Smith",
    department: "Surgery",
    engagementType: "One-on-One",
    engagementDate: "2023-11-05T00:00:00.000Z",
    facilitator: "Department Manager",
    status: "Completed",
    outcome: "Needs Improvement",
    impactScore: 2,
    followUpRequired: true,
    remarks: "Needs additional OR time management training",
  },
  {
    _id: "67f0935f268533aa55c9ec3b",
    employeeId: "EMP004",
    employeeName: "Nurse Emily Davis",
    department: "Oncology",
    engagementType: "Recognition",
    engagementDate: "2023-10-30T00:00:00.000Z",
    engagementDetails: "Employee of the Month",
    facilitator: "HR Director",
    status: "Completed",
    outcome: "Excellent",
    impactScore: 5,
    followUpRequired: false,
    remarks: "Recognized for outstanding patient care",
  },
  {
    _id: "67f0936b268533aa55c9ec3d",
    employeeId: "EMP005",
    employeeName: "Dr. James Wilson",
    department: "Radiology",
    engagementType: "Feedback",
    engagementDate: "2023-11-10T00:00:00.000Z",
    engagementDetails: "Performance Review Discussion",
    facilitator: "Chief of Radiology",
    status: "Scheduled",
    outcome: "Pending",
    impactScore: null,
    followUpRequired: false,
    remarks: "Planned discussion about new imaging protocols",
  },
];

const EmployeeEngagement = ({ profile }) => {
  const [engagementData, setEngagementData] = useState(staticEngagementData);
  const [selectedData, setSelectedData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");

  const [newEngagementData, setNewEngagementData] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    engagementType: "Training",
    engagementDate: new Date().toISOString().split("T")[0],
    engagementDetails: "",
    facilitator: "",
    status: "Scheduled",
    outcome: "Pending",
    impactScore: null,
    followUpRequired: false,
    remarks: "",
  });

  // Filter employees based on search
  const filteredEmployees = employeeList.filter(
    (emp) =>
      emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEngagementData({
      ...newEngagementData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEmployeeSelect = (employee) => {
    setNewEngagementData({
      ...newEngagementData,
      employeeId: employee.employeeId,
      employeeName: employee.name,
      department: employee.department,
    });
    setEmployeeSearch("");
  };

  const handleCreateEngagement = () => {
    const newEntry = {
      ...newEngagementData,
      _id: `temp_${Date.now()}`,
      impactScore: newEngagementData.impactScore
        ? parseInt(newEngagementData.impactScore)
        : null,
    };
    setEngagementData([...engagementData, newEntry]);
    toast.success("Engagement created successfully!");
    setCreateModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    setEngagementData(
      engagementData.filter((item) => item._id !== selectedData._id)
    );
    toast.info("Deleted Successfully!");
    setShowModal(false);
    setSelectedData(null);
  };

  const handleEditClick = (data) => {
    setSelectedData(data);
    setNewEngagementData(data);
    setEditModalOpen(true);
  };

  const handleUpdateEngagement = () => {
    setEngagementData(
      engagementData.map((item) =>
        item._id === selectedData._id ? newEngagementData : item
      )
    );
    toast.success("Updated Successfully");
    setEditModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewEngagementData({
      employeeId: "",
      employeeName: "",
      department: "",
      engagementType: "Training",
      engagementDate: new Date().toISOString().split("T")[0],
      engagementDetails: "",
      facilitator: "",
      status: "Scheduled",
      outcome: "Pending",
      impactScore: null,
      followUpRequired: false,
      remarks: "",
    });
    setEmployeeSearch("");
  };

  useEffect(() => {
    const table = new DataTable("#myTable", {
      data: engagementData,
      columns: [
        { title: "Employee ID", data: "employeeId" },
        { title: "Name", data: "employeeName" },
        { title: "Department", data: "department" },
        { title: "Type", data: "engagementType" },
        {
          title: "Date",
          data: "engagementDate",
          render: (data) => new Date(data).toLocaleDateString(),
        },
        { title: "Status", data: "status" },
        { title: "Outcome", data: "outcome" },
        {
          title: "Impact",
          data: "impactScore",
          render: (data) => (data ? `${data}/5` : "N/A"),
        },
        {
          title: "Action",
          data: null,
          render: (data) => `
            <div class="flex items-center justify-center space-x-2">
              ${
                profile?.role === "superAdmin" || profile?.role === "admin"
                  ? `
              <button 
                class="group relative inline-flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-red-50 hover:bg-red-100 transition-all duration-300 ease-in-out" 
                id="deleteBtn_${data._id}"
                title="Delete"
              >
                <span class="text-red-500 transition-colors duration-300 ease-in-out group-hover:text-red-600">
                  <i class="fas fa-trash-alt text-sm"></i>
                </span>
              </button>`
                  : ""
              }
              
              <button 
                class="group relative inline-flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-blue-50 hover:bg-blue-100 transition-all duration-300 ease-in-out" 
                id="detailBtn_${data._id}"
                title="View Details"
              >
                <span class="text-blue-700 transition-colors duration-300 ease-in-out group-hover:text-blue-800">
                  <i class="fas fa-eye text-sm"></i>
                </span>
              </button>
              
              <button 
                class="group relative inline-flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-green-50 hover:bg-green-100 transition-all duration-300 ease-in-out" 
                id="editBtn_${data._id}"
                title="Edit"
              >
                <span class="text-green-500 transition-colors duration-300 ease-in-out group-hover:text-green-600">
                  <i class="fas fa-edit text-sm"></i>
                </span>
              </button>
            </div>
          `,
        },
      ],
      rowCallback: (row, data) => {
        if (profile?.role === "superAdmin" || profile?.role === "admin") {
          const deleteBtn = row.querySelector(`#deleteBtn_${data._id}`);
          deleteBtn.addEventListener("click", () => {
            setSelectedData(data);
            setModalType("delete");
            setShowModal(true);
          });
        }

        const detailBtn = row.querySelector(`#detailBtn_${data._id}`);
        detailBtn.addEventListener("click", () => {
          setSelectedData(data);
          setModalType("detail");
          setShowModal(true);
        });

        const editBtn = row.querySelector(`#editBtn_${data._id}`);
        editBtn.addEventListener("click", () => handleEditClick(data));
      },
      responsive: true,
      destroy: true,
    });

    return () => table.destroy();
  }, [engagementData]);

  return (
    <div className="p-4">
      <PayrollSystemItem
        data={engagementData}
        title={"Hospital Employee Engagement"}
      />

      <div className="flex justify-end items-center mb-4">
        <button
          className="bg-blue-500 py-2 px-4 rounded-md text-white font-semibold hover:bg-blue-400 transition-colors"
          onClick={() => setCreateModalOpen(true)}
        >
          + New Engagement
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table id="myTable" className="display w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Outcome</th>
              <th>Impact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>

      {/* Create Engagement Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Engagement</h3>

            {/* Employee Search and Select */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">
                Search Employee
                {newEngagementData.employeeId && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Selected: {newEngagementData.employeeName} -{" "}
                    {newEngagementData.employeeId})
                  </span>
                )}
              </label>
              <input
                type="text"
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Type name or ID..."
                className="w-full p-2 border rounded"
              />
              {employeeSearch && (
                <ul className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <li
                        key={emp._id}
                        onClick={() => handleEmployeeSelect(emp)}
                        className="p-2 hover:bg-blue-50 cursor-pointer flex justify-between"
                      >
                        <span>{emp.name}</span>
                        <span className="text-sm text-gray-500">
                          {emp.employeeId} ({emp.department})
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">No employees found</li>
                  )}
                </ul>
              )}
            </div>

            {/* Auto-filled employee details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={newEngagementData.employeeId || "Not selected"}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newEngagementData.department || "Not selected"}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />
              </div>
            </div>

            {/* Engagement Details Form */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Engagement Type
              </label>
              <select
                name="engagementType"
                value={newEngagementData.engagementType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Training">Training</option>
                <option value="Team Building">Team Building</option>
                <option value="One-on-One">One-on-One</option>
                <option value="Recognition">Recognition</option>
                <option value="Feedback">Feedback</option>
                <option value="Wellness Check">Wellness Check</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="engagementDate"
                value={newEngagementData.engagementDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Details</label>
              <input
                type="text"
                name="engagementDetails"
                value={newEngagementData.engagementDetails}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Facilitator
                </label>
                <input
                  type="text"
                  name="facilitator"
                  value={newEngagementData.facilitator}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={newEngagementData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Outcome
                </label>
                <select
                  name="outcome"
                  value={newEngagementData.outcome}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Positive">Positive</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Negative">Negative</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Impact Score (1-5)
                </label>
                <input
                  type="number"
                  name="impactScore"
                  min="1"
                  max="5"
                  value={newEngagementData.impactScore || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="followUpRequired"
                checked={newEngagementData.followUpRequired}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">Follow-up Required</label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <textarea
                name="remarks"
                value={newEngagementData.remarks}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setCreateModalOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEngagement}
                disabled={!newEngagementData.employeeId}
                className={`px-4 py-2 text-white rounded-md ${
                  newEngagementData.employeeId
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Create Engagement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Engagement</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={newEngagementData.employeeId || "N/A"}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={newEngagementData.employeeName || "N/A"}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newEngagementData.department || "N/A"}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Engagement Type
                </label>
                <select
                  name="engagementType"
                  value={newEngagementData.engagementType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Training">Training</option>
                  <option value="Team Building">Team Building</option>
                  <option value="One-on-One">One-on-One</option>
                  <option value="Recognition">Recognition</option>
                  <option value="Feedback">Feedback</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="engagementDate"
                value={newEngagementData.engagementDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Details</label>
              <input
                type="text"
                name="engagementDetails"
                value={newEngagementData.engagementDetails}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Facilitator
                </label>
                <input
                  type="text"
                  name="facilitator"
                  value={newEngagementData.facilitator}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={newEngagementData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Outcome
                </label>
                <select
                  name="outcome"
                  value={newEngagementData.outcome}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Positive">Positive</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Impact Score (1-5)
                </label>
                <input
                  type="number"
                  name="impactScore"
                  min="1"
                  max="5"
                  value={newEngagementData.impactScore || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="followUpRequired"
                checked={newEngagementData.followUpRequired}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">Follow-up Required</label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <textarea
                name="remarks"
                value={newEngagementData.remarks}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEngagement}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Engagement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && modalType === "detail" && selectedData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Engagement Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <DetailItem label="Employee ID" value={selectedData.employeeId} />
              <DetailItem
                label="Employee Name"
                value={selectedData.employeeName}
              />
              <DetailItem label="Department" value={selectedData.department} />
              <DetailItem
                label="Engagement Type"
                value={selectedData.engagementType}
              />
              <DetailItem
                label="Date"
                value={new Date(
                  selectedData.engagementDate
                ).toLocaleDateString()}
              />
              <DetailItem
                label="Facilitator"
                value={selectedData.facilitator}
              />
              <DetailItem label="Status" value={selectedData.status} />
              <DetailItem label="Outcome" value={selectedData.outcome} />
              <DetailItem
                label="Impact Score"
                value={
                  selectedData.impactScore
                    ? `${selectedData.impactScore}/5`
                    : "N/A"
                }
              />
              <DetailItem
                label="Follow-up Required"
                value={selectedData.followUpRequired ? "Yes" : "No"}
              />
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Details</h3>
              <p className="text-gray-700">{selectedData.engagementDetails}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Remarks</h3>
              <p className="text-gray-700">{selectedData.remarks}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && modalType === "delete" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this engagement record?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for detail view
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-lg">{value || "N/A"}</p>
  </div>
);

export default EmployeeEngagement;
