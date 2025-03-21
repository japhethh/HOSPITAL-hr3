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
  const [editModalOpen, setEditModalOpen] = useState(false); // New state for edit modal
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
  // const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/employees`);
      console.log(response.data);

      setSelectedData(response.data);
    } catch (error) {
      console.log(error.reponse.data.message);
    }
  };

  // Sample data for employees with attendance records
  // const data = [
  //   {
  //     employeeId: "EMP001",
  //     firstName: "John",
  //     lastName: "Doe",
  //     email: "johndoe@example.com",
  //     phone: "123-456-7890",
  //     department: "Surgery",
  //     position: "Surgeon",
  //     hireDate: "2018-06-15",
  //     salary: 120000,
  //     status: "Active",
  //     attendance: [
  //       {
  //         date: "2023-10-01",
  //         clockIn: "09:00",
  //         clockOut: "17:00",
  //         totalHours: 8,
  //         status: "Present",
  //         remarks: "On time",
  //       },
  //     ],
  //   },
  //   {
  //     employeeId: "EMP002",
  //     firstName: "Jane",
  //     lastName: "Smith",
  //     email: "janesmith@example.com",
  //     phone: "987-654-3210",
  //     department: "Nursing",
  //     position: "Senior Nurse",
  //     hireDate: "2019-09-10",
  //     salary: 65000,
  //     status: "Active",
  //     attendance: [
  //       {
  //         date: "2023-10-01",
  //         clockIn: "08:30",
  //         clockOut: "16:30",
  //         totalHours: 8,
  //         status: "Present",
  //         remarks: "Early arrival",
  //       },
  //     ],
  //   },
  //   {
  //     employeeId: "EMP003",
  //     firstName: "Emily",
  //     lastName: "Brown",
  //     email: "emilybrown@example.com",
  //     phone: "456-789-0123",
  //     department: "Pediatrics",
  //     position: "Pediatrician",
  //     hireDate: "2020-03-25",
  //     salary: 110000,
  //     status: "Active",
  //     attendance: [
  //       {
  //         date: "2023-10-01",
  //         clockIn: "09:15",
  //         clockOut: "17:15",
  //         totalHours: 8,
  //         status: "Present",
  //         remarks: "Late arrival",
  //       },
  //     ],
  //   },
  // ];

  const handleCreateEmployee = async () => {
    // try {
    //   const response = await axios.post(
    //     `${apiURL}/api/payrollSystem/`,
    //     newEmployeeData
    //   );

    // fetchData()

    //   toast.success(response.data.message);
    // } catch (error) {
    //   console.log(error?.response.data.message);
    // }

    const updatedData = [...data, newEmployeeData];
    setEmployeeData(updatedData);
    setCreateModalOpen(false);
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
  };

  const handleDelete = async () => {
    // try {
    //   const response = await axios.delete(`${apiURL}/api/Employee/`);
    // // fetchData()
    //   toast.error(response.data.message);
    // } catch (error) {
    //   console.log(error?.response.data.message);
    // }
  };

  // Function to handle edit button click
  const handleEditClick = (data) => {
    setSelectedData(data);
    setNewEmployeeData(data); // Pre-fill the form with selected data
    setEditModalOpen(true); // Open the edit modal
  };

  // Function to handle update employee
  const handleUpdateEmployee = async () => {
    // try {
    //   const response = await axios.put(
    //     `${apiURL}/api/Employee/`,
    //     newEmployeeData
    //   );
    // fetchData()

    //   toast.info(response.data.message);
    // } catch (error) {
    //   console.log(error?.response.data.message);
    // }

    const updatedData = employeeData.map((employee) =>
      employee.employeeId === selectedData.employeeId
        ? newEmployeeData
        : employee
    );
    setEmployeeData(updatedData);
    setEditModalOpen(false);
    setSelectedData(null);
  };

  useEffect(() => {
    const table = new DataTable("#myTable", {
      data: employeeData.length > 0 ? employeeData : data,
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
  }, [employeeData]);

  return (
    <div className="p-4">
      <PayrollSystemItem />

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
