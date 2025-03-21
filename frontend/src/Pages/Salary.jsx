import { useEffect, useState } from "react";
import DataTable from "datatables.net-dt";
import PayrollSystemItem from "../Components/PayrollSystemItem";
import axios from "axios";
import { apiURL } from "../context/Store";
import { toast } from "react-toastify";

const Salary = () => {
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [salaryData, setSalaryData] = useState([]); // Initialize as an empty array
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newSalaryData, setNewSalaryData] = useState({
    employeeId: "",
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    netSalary: 0,
    paymentDate: new Date().toISOString().split("T")[0], // Default to today's date
    status: "Pending",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/salaries`);
      console.log(response.data);
      setSalaryData(response.data || []); // Ensure it's always an array
    } catch (error) {
      console.log(error?.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSalaryData({
      ...newSalaryData,
      [name]: value,
    });
  };

  const handleCreateSalary = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/api/salaries`,
        newSalaryData
      );
      toast.success("Salary record created successfully!");
      fetchData(); // Refresh the data
      setCreateModalOpen(false); // Close the modal
      setNewSalaryData({
        employeeId: "",
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
        netSalary: 0,
        paymentDate: new Date().toISOString().split("T")[0],
        status: "Pending",
      }); // Reset the form
    } catch (error) {
      console.error("Error creating salary record:", error);
      toast.error("Failed to create salary record.");
    }
  };

  const handleDeleteSalary = async () => {
    try {
      await axios.delete(`${apiURL}/api/salaries/${selectedSalary._id}`);
      toast.success("Salary record deleted successfully!");
      fetchData(); // Refresh the data
      setShowModal(false); // Close the modal
      setSelectedSalary(null); // Reset selected salary
    } catch (error) {
      console.error("Error deleting salary record:", error);
      toast.error("Failed to delete salary record.");
    }
  };

  const handleEditClick = (salary) => {
    setSelectedSalary(salary);
    setNewSalaryData({
      ...salary,
      paymentDate: salary.paymentDate.split("T")[0], // Ensure the date is in the correct format
    });
    setEditModalOpen(true); // Open the edit modal
  };

  const handleUpdateSalary = async () => {
    try {
      const response = await axios.put(
        `${apiURL}/api/salaries/${selectedSalary._id}`,
        newSalaryData
      );
      toast.success("Salary record updated successfully!");
      fetchData(); // Refresh the data
      setEditModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error updating salary record:", error);
      toast.error("Failed to update salary record.");
    }
  };

  useEffect(() => {
    const table = new DataTable("#salaryTable", {
      data: salaryData, // Use salaryData instead of selectedSalary
      columns: [
        {
          title: "Employee ID",
          data: "employeeId",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Basic Salary",
          data: "basicSalary",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Allowances",
          data: "allowances",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Deductions",
          data: "deductions",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Net Salary",
          data: "netSalary",
          render: (data) => `${data ? data : "N/A"}`,
        },
        {
          title: "Payment Date",
          data: "paymentDate",
          render: (data) => `${data ? data : "N/A"}`,
        },
        { title: "Status", data: "status" },
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
          setModalType("delete");
          setSelectedSalary(data);
          setShowModal(true);
        });

        const detailBtn = row.querySelector(`#detailBtn_${data._id}`);
        if (detailBtn) {
          detailBtn.addEventListener("click", () => {
            setSelectedSalary(data);
            setModalType("detail");
            setShowModal(true);
          });
        }

        const editBtn = row.querySelector(`#editBtn_${data._id}`);
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
  }, [salaryData]); // Reinitialize when salaryData changes

  return (
    <div className="p-4">
      <PayrollSystemItem />

      <div className="flex justify-end items-center">
        <button
          className="bg-blue-500 py-2 px-4 rounded-md text-white font-semibold hover:bg-blue-400"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Salary
        </button>
      </div>
      <div className="overflow-x-auto">
        <table id="salaryTable" className="display w-full"></table>
      </div>

      {/* Create Salary Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Create Salary</h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newSalaryData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="basicSalary"
                placeholder="Basic Salary"
                value={newSalaryData.basicSalary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="allowances"
                placeholder="Allowances"
                value={newSalaryData.allowances}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="deductions"
                placeholder="Deductions"
                value={newSalaryData.deductions}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="netSalary"
                placeholder="Net Salary"
                value={newSalaryData.netSalary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="paymentDate"
                placeholder="Payment Date"
                value={newSalaryData.paymentDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newSalaryData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleCreateSalary}
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

      {/* Edit Salary Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Edit Salary</h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newSalaryData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="basicSalary"
                placeholder="Basic Salary"
                value={newSalaryData.basicSalary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="allowances"
                placeholder="Allowances"
                value={newSalaryData.allowances}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="deductions"
                placeholder="Deductions"
                value={newSalaryData.deductions}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="netSalary"
                placeholder="Net Salary"
                value={newSalaryData.netSalary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="paymentDate"
                placeholder="Payment Date"
                value={newSalaryData.paymentDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newSalaryData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleUpdateSalary}
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
            <h3 className="text-lg font-bold font-Roboto">Delete Salary</h3>
            <p className="py-4 font-Roboto">
              Are you sure you want to{" "}
              <span className="text-red-500 font-bold font-Roboto">delete</span>{" "}
              this salary record?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  handleDeleteSalary();
                  setShowModal(false);
                }}
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
      {showModal && modalType === "detail" && selectedSalary && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg overflow-hidden">
            <h1 className="text-xl font-semibold py-2 font-Roboto text-gray-800">
              Salary Details
            </h1>
            <div className="overflow-y-scroll h-60 ">
              <div className="space-y-3 grid grid-cols-2 gap-3 ">
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="employeeId" className="label">
                      Employee ID
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedSalary.employeeId}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="basicSalary" className="label">
                      Basic Salary
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedSalary.basicSalary}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="allowances" className="label">
                      Allowances
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedSalary.allowances}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="deductions" className="label">
                      Deductions
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedSalary.deductions}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="netSalary" className="label">
                      Net Salary
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedSalary.netSalary}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="paymentDate" className="label">
                      Payment Date
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedSalary.paymentDate}
                  </div>
                </div>
                <div className="flex border rounded-lg overflow-hidden">
                  <div className="w-1/2 bg-gray-100 p-2 flex justify-center items-center font-Roboto font-medium">
                    <label htmlFor="status" className="label">
                      Status
                    </label>
                  </div>
                  <div className="w-1/2 p-4 flex font-semibold text-xl justify-center items-center">
                    {selectedSalary.status}
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

export default Salary;
