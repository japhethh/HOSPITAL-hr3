import { useEffect, useState, useRef } from "react";
import DataTable from "datatables.net-dt";
import PayrollSystemItem from "../Components/PayrollSystemItem";
import axios from "axios";
import { apiURL } from "../context/Store";
import { toast } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { EmployeePdfDocument } from "../Components/EmployeePdfDocument";

const Employee = ({ profile }) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    position: "",
    status: "",
    search: "",
  });

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

  useEffect(() => {
    applyFilters();
  }, [employeeData, filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/employees`);
      setEmployeeData(response.data);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = () => {
    let result = [...employeeData];

    if (filters.department) {
      result = result.filter((emp) =>
        emp.department.toLowerCase().includes(filters.department.toLowerCase())
      );
    }

    if (filters.position) {
      result = result.filter((emp) =>
        emp.position.toLowerCase().includes(filters.position.toLowerCase())
      );
    }

    if (filters.status) {
      result = result.filter(
        (emp) => emp.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(searchTerm) ||
          emp.lastName.toLowerCase().includes(searchTerm) ||
          emp.email.toLowerCase().includes(searchTerm) ||
          emp.employeeId.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredData(result);
  };

  const resetFilters = () => {
    setFilters({
      department: "",
      position: "",
      status: "",
      search: "",
    });
  };

  const getUniqueValues = (key) => {
    const unique = new Set();
    employeeData.forEach((emp) => unique.add(emp[key]));
    return Array.from(unique).sort();
  };

  const handleCreateEmployee = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/api/employees`,
        newEmployeeData
      );
      toast.success("Employee created successfully!");
      fetchData();
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
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiURL}/api/employees/${selectedData._id}`);
      toast.success("Employee deleted successfully!");
      fetchData();
      setShowModal(false);
      setSelectedData(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee.");
    }
  };

  const handleEditClick = (data) => {
    setSelectedData(data);
    setNewEmployeeData(data);
    setEditModalOpen(true);
  };

  const handleUpdateEmployee = async () => {
    try {
      const response = await axios.put(
        `${apiURL}/api/employees/${selectedData._id}`,
        newEmployeeData
      );
      toast.success("Employee updated successfully!");
      fetchData();
      setEditModalOpen(false);
      setSelectedData(null);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee.");
    }
  };

  const pdfRef = useRef();

  const downloadPDF = async () => {
    const input = pdfRef.current;

    if (!input) {
      toast.error("Failed to generate PDF - content not found");
      return;
    }

    // Create a clone of the content to avoid modifying the original DOM
    const clone = input.cloneNode(true);

    // Function to replace unsupported CSS color functions
    const replaceUnsupportedColors = (node) => {
      if (node.style) {
        // Replace oklch colors with standard colors
        if (node.style.color.includes("oklch")) {
          node.style.color = "#000000"; // Fallback to black
        }
        if (node.style.backgroundColor.includes("oklch")) {
          node.style.backgroundColor = "#ffffff"; // Fallback to white
        }
      }

      // Process child nodes
      if (node.childNodes) {
        node.childNodes.forEach(replaceUnsupportedColors);
      }
    };

    // Process the clone
    replaceUnsupportedColors(clone);

    // Set up the clone for rendering
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.width = `${input.offsetWidth}px`;
    clone.style.backgroundColor = "#ffffff";
    document.body.appendChild(clone);

    try {
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 40;

      const canvas = await html2canvas(clone, {
        scale: 1,
        logging: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: "#ffffff",
        ignoreElements: (element) => {
          return (
            element.tagName === "BUTTON" ||
            element.classList.contains("dataTables_paginate") ||
            element.classList.contains("dataTables_info")
          );
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add header
      pdf.setFontSize(18);
      pdf.setTextColor(40);
      pdf.setFont("helvetica", "bold");
      pdf.text("Employee Report", margin, margin + 20);

      pdf.text(
        `Generated: ${new Date().toLocaleString()}`,
        pageWidth - margin,
        margin + 20,
        { align: "right" }
      );

      // Add content
      pdf.addImage(imgData, "PNG", margin, margin + 40, imgWidth, imgHeight);

      // Add page numbers
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pdf.internal.pageSize.getHeight() - 20,
          { align: "center" }
        );
      }

      pdf.save("employee_report.pdf");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      // Clean up
      document.body.removeChild(clone);
    }
  };
  useEffect(() => {
    const table = new DataTable("#myTable", {
      data: filteredData.length > 0 ? filteredData : employeeData,
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
             <div class="flex items-center justify-center space-x-2">
             ${
               profile?.role === "superAdmin" || profile?.role === "admin"
                 ? ` <button 
                class="group relative inline-flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-red-50 hover:bg-red-100 transition-all duration-300 ease-in-out" 
                id="deleteBtn_${data?._id}"
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
                id="detailBtn_${data?._id}"
                title="View Details"
              >
                <span class="text-blue-700 transition-colors duration-300 ease-in-out group-hover:text-blue-800">
                  <i class="fas fa-eye text-sm"></i>
                </span>
                <div class="absolute inset-0 border-2 border-blue-700 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>
            </div>`;
          },
        },
      ],
      rowCallback: (row, data) => {
        if (profile?.role === "superAdmin" || profile?.role === "admin") {
          const deleteBtn = row.querySelector(`#deleteBtn_${data?._id}`);
          deleteBtn.addEventListener("click", () => {
            setSelectedData(data);
            setModalType("delete");
            setShowModal(true);
          });
        }

        const detailBtn = row.querySelector(`#detailBtn_${data?._id}`);
        if (detailBtn) {
          detailBtn.addEventListener("click", () => {
            setSelectedData(data);
            setModalType("detail");
            setShowModal(true);
          });
        }

        const editBtn = row.querySelector(`#editBtn_${data?._id}`);
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
  }, [employeeData, filteredData]);

  return (
    <div className="p-4">
      {/* PDF Export Button */}
      <div className="flex justify-end items-center gap-4 mb-4">
        <PDFDownloadLink
          document={
            <EmployeePdfDocument
              employees={filteredData.length > 0 ? filteredData : employeeData}
              filters={filters}
              title="Employee Report"
            />
          }
          fileName="employee_report.pdf"
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
          Create Employee
        </button>
      </div>

      {/* Content to be exported to PDF */}
      <div ref={pdfRef}>
        {/* PDF Header (hidden on screen) */}
        <div className="pdf-only" style={{ display: "none" }}>
          <h1 className="text-2xl font-bold mb-2">Employee Report</h1>
          <p className="text-gray-500 text-sm">
            Generated on: {new Date().toLocaleDateString()}
          </p>
          <hr className="my-2 border-gray-200" />
        </div>

        <PayrollSystemItem data={employeeData} title={"Employee Data"} />

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-semibold mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by name, email or ID"
                className="w-full p-2 border rounded"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                name="position"
                value={filters.position}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All Positions</option>
                {getUniqueValues("position").map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>

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
                <option value="On Leave">On Leave</option>
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

        <div className="overflow-x-auto">
          <table id="myTable" className="display">
            <thead className="bg-blue-500 text-white"></thead>
          </table>
        </div>

        {/* PDF Footer (hidden on screen) */}
        <div className="pdf-only" style={{ display: "none" }}>
          <hr className="my-2 border-gray-200" />
          <p className="text-gray-500 text-xs text-center">
            Confidential Employee Data - © {new Date().getFullYear()} Your
            Company
          </p>
        </div>
      </div>

      {/* Hide PDF-only elements on screen */}
      <style>
        {`
          @media screen {
            .pdf-only {
              display: none !important;
            }
          }
        `}
      </style>

      {/* All existing modals remain unchanged */}
      {createModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-1/3">
            <h3 className="text-lg font-bold font-Roboto">Create Employee</h3>
            <div className="space-y-4 mt-4">
              {/* <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={newEmployeeData.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              /> */}
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
                disabled
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
