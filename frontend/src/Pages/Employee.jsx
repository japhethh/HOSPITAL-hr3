import { useEffect, useState } from "react";
import DataTable from "datatables.net-dt";
import PayrollSystemItem from "../Components/PayrollSystemItem";
import axios from "axios";
import { apiURL } from "../context/Store";
import { toast } from "react-toastify";

const Employee = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    hireDate: "",
    salary: 0,
    status: "Active",
    attendance: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/employees`);
      console.log(response.data);
      setEmployeeData(response.data); // Set the fetched data to employeeData
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployeeData({
      ...newEmployeeData,
      [name]: value,
    });
  };

  const handleCreateEmployee = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/api/employees`,
        newEmployeeData
      );
      toast.success("Employee created successfully!");
      fetchData(); // Refresh the data
      setCreateModalOpen(false); // Close the modal
      setNewEmployeeData({
        employeeId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        hireDate: "",
        salary: 0,
        status: "Active",
        attendance: [],
      }); // Reset the form
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiURL}/api/employees/${selectedData._id}`);
      toast.success("Employee deleted successfully!");
      fetchData(); // Refresh the data
      setShowModal(false); // Close the modal
      setSelectedData(null); // Reset selected data
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee.");
    }
  };

  const handleEditClick = (data) => {
    setSelectedData(data);
    setNewEmployeeData(data); // Pre-fill the form with selected data
    setEditModalOpen(true); // Open the edit modal
  };

  const handleUpdateEmployee = async () => {
    try {
      const response = await axios.put(
        `${apiURL}/api/employees/${selectedData._id}`,
        newEmployeeData
      );
      toast.success("Employee updated successfully!");
      fetchData(); // Refresh the data
      setEditModalOpen(false); // Close the modal
      setSelectedData(null); // Reset selected data
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee.");
    }
  };

  useEffect(() => {
    const table = new DataTable("#myTable", {
      data: employeeData,
      columns: [
        { title: "Employee ID", data: "employeeId" },
        {
          title: "Name",
          data: null,
          render: (data) => `${data.firstName} ${data.lastName}`,
        },
        { title: "Department", data: "department" },
        { title: "Position", data: "position" },
        { title: "Email", data: "email" },
        { title: "Phone", data: "phone" },
        { title: "Hire Date", data: "hireDate" },
        { title: "Salary", data: "salary" },
        { title: "Status", data: "status" },
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
  }, [employeeData]); // Reinitialize when employeeData changes

  return (
    <div className="p-4">
      <PayrollSystemItem data={employeeData} title={'Employee Data'}/>

      <div className="flex justify-end items-center">
        <button
          className="bg-blue-500 py-2 px-4 rounded-md text-white font-semibold hover:bg-blue-400"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Employee
        </button>
      </div>
      <div className="overflow-x-auto">
        <table id="myTable" className="display w-full"></table>
      </div>

      {/* Create Employee Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Create Employee</h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newEmployeeData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newEmployeeData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newEmployeeData.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newEmployeeData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newEmployeeData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={newEmployeeData.department}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={newEmployeeData.position}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="hireDate"
                placeholder="Hire Date"
                value={newEmployeeData.hireDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={newEmployeeData.salary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newEmployeeData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleCreateEmployee}
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

      {/* Edit Employee Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Edit Employee</h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newEmployeeData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled // Disable editing of Employee ID
              />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newEmployeeData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newEmployeeData.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newEmployeeData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newEmployeeData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={newEmployeeData.department}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={newEmployeeData.position}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="hireDate"
                placeholder="Hire Date"
                value={newEmployeeData.hireDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={newEmployeeData.salary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newEmployeeData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleUpdateEmployee}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setNewEmployeeData({
                    employeeId: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    department: "",
                    position: "",
                    hireDate: "",
                    salary: 0,
                    status: "Active",
                    attendance: [],
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
            <h3 className="text-lg font-bold font-Roboto">Delete Employee</h3>
            <p className="py-4 font-Roboto">
              Are you sure you want to{" "}
              <span className="text-red-500 font-bold font-Roboto">delete</span>{" "}
              the employee record for{" "}
              <span className="font-bold font-Roboto">
                {selectedData?.firstName} {selectedData?.lastName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDelete}
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
              Employee Details
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
                    <label htmlFor="name" className="label">
                      Name
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedData?.firstName} {selectedData?.lastName}
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

export default Employee;
