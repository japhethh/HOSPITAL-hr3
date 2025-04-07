import { useEffect, useState } from "react";
import DataTable from "datatables.net-dt";
import PayrollSystemItem from "../Components/PayrollSystemItem";
import axios from "axios";
import { apiURL } from "../context/Store";
import { toast } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PayrollPdfDocument } from "../Components/PayrollPdfDocument";

const PayrollSystem = ({ profile }) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    employeeId: "",
    name: "",
    department: "",
    status: "",
    salaryRange: "",
    search: "",
  });

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

  useEffect(() => {
    applyFilters();
  }, [inventoryData, filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/payroll-systems`);
      setInventoryData(response.data);
    } catch (error) {
      console.log(error?.response.data.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = () => {
    let result = [...inventoryData];

    // Apply employee ID filter
    if (filters.employeeId) {
      result = result.filter((item) =>
        item.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())
      );
    }

    // Apply name filter
    if (filters.name) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Apply department filter
    if (filters.department) {
      result = result.filter((item) =>
        item.department.toLowerCase().includes(filters.department.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(
        (item) => item.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Apply salary range filter
    if (filters.salaryRange) {
      const [min, max] = filters.salaryRange.split("-").map(Number);
      result = result.filter((item) => {
        const salary = Number(item.salary);
        return salary >= min && salary <= max;
      });
    }

    // Apply search filter (searches multiple fields)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.employeeId.toLowerCase().includes(searchTerm) ||
          item.name.toLowerCase().includes(searchTerm) ||
          item.department.toLowerCase().includes(searchTerm) ||
          item.position.toLowerCase().includes(searchTerm) ||
          (item.email && item.email.toLowerCase().includes(searchTerm)) ||
          (item.phone && item.phone.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredData(result);
  };

  const resetFilters = () => {
    setFilters({
      employeeId: "",
      name: "",
      department: "",
      status: "",
      salaryRange: "",
      search: "",
    });
  };

  const getUniqueValues = (key) => {
    const unique = new Set();
    inventoryData.forEach((item) => unique.add(item[key]));
    return Array.from(unique).sort();
  };

  const handleCreatePayroll = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/api/payroll-systems`,
        newPayrollData
      );

      fetchData();
      toast.success(response.data.message);
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
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to create payroll");
    }
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
      await axios.delete(`${apiURL}/api/payroll-systems/${selectedData?._id}`);

      toast.info("Deleted Successfully!");
      fetchData();
      setShowModal(false);
      setSelectedData(null);
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to delete payroll");
    }
  };

  const handleSendToDepartments = () => {
    if (profile?.role === "hr3") {
      toast.success(
        `Payroll for ${selectedData.name} sent to Finance department!`,
        { position: "top-right", autoClose: 3000 }
      );
      setTimeout(() => {
        toast.success(
          `Payroll for ${selectedData.name} sent to HR2 department!`,
          { position: "top-right", autoClose: 3000 }
        );
      }, 1000);
    } else {
      toast.success(
        `Payroll for ${selectedData.name} sent to Finance department!`,
        { position: "top-right", autoClose: 3000 }
      );
    }
    setShowModal(false);
    setSelectedData(null);
  };

  useEffect(() => {
    const table = new DataTable("#myTable", {
      data: filteredData.length > 0 ? filteredData : inventoryData,
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
                  ? `<button 
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
                class="group relative inline-flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-purple-50 hover:bg-purple-100 transition-all duration-300 ease-in-out" 
                id="financeBtn_${data.employeeId}"
                title="Send to Finance"
              >
                <span class="text-purple-500 transition-colors duration-300 ease-in-out group-hover:text-purple-600">
                  <i class="fas fa-paper-plane text-sm"></i>
                </span>
                <div class="absolute inset-0 border-2 border-purple-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
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
        if (profile?.role === "superAdmin" || profile.role === "admin") {
          const deleteBtn = row.querySelector(`#deleteBtn_${data?.employeeId}`);
          deleteBtn.addEventListener("click", () => {
            setSelectedData(data);
            setModalType("delete");
            setShowModal(true);
          });
        }

        const financeBtn = row.querySelector(`#financeBtn_${data?.employeeId}`);
        if (financeBtn) {
          financeBtn.addEventListener("click", () => {
            setSelectedData(data);
            setModalType("finance");
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
  }, [inventoryData, filteredData]);

  return (
    <div className="p-4">
      {/* PDF Export Button */}
      <div className="flex justify-end items-center gap-4 mb-4">
        <PDFDownloadLink
          document={
            <PayrollPdfDocument
              payrollData={
                filteredData.length > 0 ? filteredData : inventoryData
              }
              filters={filters}
              title="Payroll Report"
            />
          }
          fileName="payroll_report.pdf"
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
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Payroll
        </button>
      </div>
      <PayrollSystemItem data={inventoryData} title={"Payroll Data"} />

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold mb-3">Payroll Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              placeholder="Search by ID, name, department..."
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Second Row of Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Filter by Name"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Salary Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range
            </label>
            <select
              name="salaryRange"
              value={filters.salaryRange}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Salaries</option>
              <option value="0-50000">₱0 - ₱50,000</option>
              <option value="50001-100000">₱50,001 - ₱100,000</option>
              <option value="100001-150000">₱100,001 - ₱150,000</option>
              <option value="150001-200000">₱150,001 - ₱200,000</option>
              <option value="200001-999999">₱200,001+</option>
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

      {/* Send to Finance Modal */}
      {showModal && modalType === "finance" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {profile.role === "hr3"
                ? "Send to Departments"
                : "Send to Finance"}
            </h3>
            <p className="mb-4">
              {profile.role === "hr3"
                ? "This will send to Finance and HR2 departments"
                : "This will send to Finance department"}
            </p>
            <div className="hidden" id="fakeLoading">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
              <p className="text-center text-gray-600">
                Sending payroll data...
              </p>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  document
                    .getElementById("fakeLoading")
                    .classList.remove("hidden");
                  setTimeout(handleSendToDepartments, 1500);
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
              >
                Confirm Send
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
          <div className="bg-white max-w-2xl rounded-lg p-6 w-full shadow-lg overflow-hidden">
            <h1 className="text-2xl font-semibold py-2 font-Roboto text-gray-800">
              Payroll Details
            </h1>
            <div className="overflow-y-scroll h-72">
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
