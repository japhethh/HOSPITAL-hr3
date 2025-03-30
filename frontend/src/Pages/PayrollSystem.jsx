import { useEffect, useState } from "react";
import DataTable from "datatables.net-dt";
import PayrollSystemItem from "../Components/PayrollSystemItem";
import axios from "axios";
import { apiURL } from "../context/Store";
import { toast } from "react-toastify";

const PayrollSystem = ({ profile }) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPayrollData, setNewPayrollData] = useState({
    employeeId: "",
    name: "",
    department: "",
    position: "",
    email: "",
    phone: "",
    leave: "",
    salary: "",
    hireDate: "",
    status: "Active",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/payroll-systems`);
      console.log(response.data);
      setInventoryData(response.data);
    } catch (error) {
      console.log(error?.response.data.message);
    }
  };

  const handleCreatePayroll = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/api/payroll-systems`,
        newPayrollData
      );

      fetchData();
      toast.success(response.data.message);
    } catch (error) {
      console.log(error?.response.data.message);
    }

    setCreateModalOpen(false);
    setNewPayrollData({
      employeeId: "",
      name: "",
      department: "",
      position: "",
      email: "",
      phone: "",
      leave: "",
      salary: "",
      hireDate: "",
      status: "Active",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (modalType === "edit") {
      setSelectedData({
        ...selectedData,
        [name]: value,
      });
    } else {
      setNewPayrollData({
        ...newPayrollData,
        [name]: value,
      });
    }
  };

  const handleUpdatePayroll = async () => {
    try {
      const response = await axios.put(
        `${apiURL}/api/payroll-systems/${selectedData._id}`,
        selectedData
      );

      fetchData();
      toast.success(response.data.message);

      setShowModal(false);
      setSelectedData(null);
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to update payroll");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${apiURL}/api/payroll-systems/${selectedData?._id}`
      );

      toast.info("Deleted Successfully!");

      fetchData();
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to delete payroll");
    }
    if (selectedData) {
      const updatedData = inventoryData.filter(
        (item) => item.employeeId !== selectedData.employeeId
      );
      setInventoryData(updatedData);
      setShowModal(false);
      setSelectedData(null);
    }
  };

  useEffect(() => {
    const table = new DataTable("#myTable", {
      data: inventoryData,
      columns: [
        {
          title: "Employee ID",
          data: "employeeId",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Name",
          data: "name",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Department",
          data: "department",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Email",
          data: "email",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Phone",
          data: "phone",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Leave",
          data: "leave",
          render: (data) => `${data ? data : "N/A"}`,
        },
        // Conditionally add Salary column
        ...(profile?.role === "superAdmin" || profile?.role === "admin"
          ? [
              {
                title: "Salary",
                data: "salary",
                render: (data) => `${data ? data : "N/A"}`,
              },
            ]
          : []),
        { title: "Status", data: "status" },
        {
          title: "Action",
          data: null,
          render: (data) => {
            return `
            <div class="flex items-center justify-center space-x-2">

            ${
              profile?.role === "superAdmin" || profile.role === "admin"
                ? `    <button 
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
      rowCallback: (row, data) => {
        if (profile?.role === "superAdmin" || profile.role === "admin") {
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
            setSelectedData(data);
            setModalType("edit");
            setShowModal(true);
          });
        }
      },
      responsive: true,
      destroy: true,
    });

    return () => {
      table.destroy();
    };
  }, [inventoryData]);

  return (
    <div className="p-4">
      <PayrollSystemItem data={inventoryData} title={"Payroll Data"} />

      <div className="flex justify-end items-center">
        <button
          className="bg-blue-500 py-2 px-4 rounded-md text-white font-semibold hover:bg-blue-400"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Payroll
        </button>
      </div>
      <div className="overflow-x-auto">
        <table id="myTable" className="display">
          <thead className="bg-blue-500 text-white"></thead>
        </table>
      </div>

      {/* Create Payroll Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Create Payroll</h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newPayrollData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newPayrollData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={newPayrollData.department}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={newPayrollData.position}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newPayrollData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newPayrollData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="leave"
                value={newPayrollData.leave}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Leave</option>
                <option value="sick">Sick</option>
                <option value="vacation">Vacation</option>
                <option value="maternity">Maternity</option>
                <option value="paternity">Paternity</option>
              </select>
              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={newPayrollData.salary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="hireDate"
                placeholder="Hire Date"
                value={newPayrollData.hireDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newPayrollData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleCreatePayroll}
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

      {/* Delete Modal */}
      {showModal && modalType === "delete" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Delete Payroll</h3>
            <p className="py-4 font-Roboto">
              Are you sure you want to{" "}
              <span className="text-red-500 font-bold font-Roboto">delete</span>{" "}
              the payroll record for{" "}
              <span className="font-bold font-Roboto">
                {selectedData?.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="btn btn-outline btn-error btn-md text-white font-Roboto"
                onClick={() => {
                  setSelectedData(null);
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-error btn-md text-white font-Roboto"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && modalType === "edit" && selectedData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Edit Payroll</h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={selectedData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={selectedData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={selectedData.department}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={selectedData.position}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={selectedData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={selectedData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="leave"
                value={selectedData.leave}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Leave</option>
                <option value="sick">Sick</option>
                <option value="vacation">Vacation</option>
                <option value="maternity">Maternity</option>
                <option value="paternity">Paternity</option>
              </select>
              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={selectedData?.salary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="hireDate"
                placeholder="Hire Date"
                value={selectedData.hireDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={selectedData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleUpdatePayroll}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
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
          <div className="bg-white   max-w-2xl  rounded-lg p-6 w-full  shadow-lg overflow-hidden">
            <h1 className="text-2xl font-semibold py-2 font-Roboto text-gray-800">
              Payroll Details
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
                    <label htmlFor="name" className="label">
                      Name
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.name}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="department" className="label">
                      Department
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.department}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="position" className="label">
                      Position
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.position}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="email" className="label">
                      Email
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.email}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="phone" className="label">
                      Phone
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.phone}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="leave" className="label">
                      Leave
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.leave}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="salary" className="label">
                      Salary
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.salary}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="hireDate" className="label">
                      Hire Date
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.hireDate}
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

export default PayrollSystem;
