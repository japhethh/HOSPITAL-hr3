import { useState, useEffect } from "react";
import DataTable from "datatables.net-dt";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import PayrollSystemItem from "../Components/PayrollSystemItem";

// Payslip Document Component
const PayslipDocument = ({ employee }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: "Helvetica",
    },
    header: {
      marginBottom: 20,
      textAlign: "center",
      borderBottom: "1px solid #000",
      paddingBottom: 10,
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 14,
      marginBottom: 5,
      fontWeight: "bold",
      borderBottom: "1px solid #ccc",
      paddingBottom: 3,
    },
    row: {
      flexDirection: "row",
      marginBottom: 5,
    },
    label: {
      width: "60%",
      fontWeight: "bold",
    },
    value: {
      width: "40%",
      textAlign: "right",
    },
    totalRow: {
      flexDirection: "row",
      marginTop: 10,
      borderTop: "1px solid #000",
      paddingTop: 5,
      fontWeight: "bold",
    },
    hospitalLogo: {
      width: 100,
      height: 50,
      marginBottom: 10,
    },
  });

  // Calculate payroll values
  const basicSalary = employee.salary || 0;
  const tax = basicSalary * 0.15;
  const sss = 500;
  const philhealth = 300;
  const pagibig = 100;
  const totalDeductions = tax + sss + philhealth + pagibig;
  const netPay = basicSalary - totalDeductions;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            HOSPITAL MANAGEMENT SYSTEM
          </Text>
          <Text style={{ fontSize: 16, marginTop: 5 }}>EMPLOYEE PAYSLIP</Text>
          <Text style={{ fontSize: 12, marginTop: 5 }}>
            Pay Period:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Employee ID:</Text>
            <Text style={styles.value}>{employee.employeeId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {employee.firstName} {employee.lastName}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{employee.department}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Position:</Text>
            <Text style={styles.value}>{employee.position}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Basic Salary:</Text>
            <Text style={styles.value}>
              ₱
              {basicSalary.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Overtime Pay:</Text>
            <Text style={styles.value}>₱0.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Night Differential:</Text>
            <Text style={styles.value}>₱0.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Total Earnings:</Text>
            <Text style={styles.value}>
              ₱
              {basicSalary.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deductions</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Withholding Tax:</Text>
            <Text style={styles.value}>
              ₱
              {tax.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>SSS Contribution:</Text>
            <Text style={styles.value}>
              ₱
              {sss.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>PhilHealth:</Text>
            <Text style={styles.value}>
              ₱
              {philhealth.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pag-IBIG:</Text>
            <Text style={styles.value}>
              ₱
              {pagibig.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Total Deductions:</Text>
            <Text style={styles.value}>
              ₱
              {totalDeductions.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text style={{ ...styles.label, width: "70%" }}>NET PAY:</Text>
            <Text style={{ ...styles.value, width: "30%", fontSize: 16 }}>
              ₱
              {netPay.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 30, fontSize: 10, textAlign: "center" }}>
          <Text>
            This is a computer generated payslip and does not require signature
          </Text>
          <Text style={{ marginTop: 5 }}>
            For inquiries, please contact HR Department
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Complete static employee data
const staticEmployees = [
  {
    _id: "67f09ca3e733a50f5cf1860f",
    employeeId: "EMP3",
    firstName: "HARVEY",
    lastName: "RONOLO",
    email: "hronolop@gmail.com",
    phone: "09075907437",
    department: "ER",
    position: "HR",
    hireDate: "2025-04-05T00:00:00.000Z",
    salary: 25000,
    status: "Active",
    attendance: [],
    qualifications: ["MD", "Emergency Medicine"],
    licenseNumber: "MED12345",
    emergencyContact: {
      name: "Jane Ronolo",
      relationship: "Spouse",
      phone: "09075907438",
    },
    address: "123 Medical St, City",
    gender: "Male",
    birthDate: "1990-05-15",
    certifications: ["ACLS", "BLS"],
    shiftPreference: "Day",
    yearsOfService: 2,
  },
  {
    _id: "67f0dbb29f41d4131127a550",
    employeeId: "EMP13",
    firstName: "Melvin",
    lastName: "Abat",
    email: "melvin002@gmail.com",
    phone: "09874627381",
    department: "HR",
    position: "ER",
    hireDate: "2025-04-05T00:00:00.000Z",
    salary: 20000,
    status: "Active",
    attendance: [],
    qualifications: ["RN", "Emergency Nursing"],
    licenseNumber: "NUR54321",
    emergencyContact: {
      name: "Maria Abat",
      relationship: "Mother",
      phone: "09874627382",
    },
    address: "456 Care Ave, City",
    gender: "Male",
    birthDate: "1988-11-20",
    certifications: ["PALS", "TNCC"],
    shiftPreference: "Night",
    yearsOfService: 5,
  },
  {
    _id: "67f123f057d5659fce266ddc",
    employeeId: "EMP30",
    firstName: "jayvee",
    lastName: "abat",
    email: "jayveeabat@gmail.com",
    phone: "09813250045",
    department: "hr",
    position: "ER",
    hireDate: "2025-04-05T00:00:00.000Z",
    salary: 20000,
    status: "Active",
    attendance: [],
    qualifications: ["RN", "Critical Care"],
    licenseNumber: "NUR98765",
    emergencyContact: {
      name: "Lorna Abat",
      relationship: "Spouse",
      phone: "09813250046",
    },
    address: "789 Health Blvd, City",
    gender: "Male",
    birthDate: "1985-07-10",
    certifications: ["ACLS", "BLS", "CCRN"],
    shiftPreference: "Rotating",
    yearsOfService: 8,
  },
  {
    _id: "67f5b7c2da6520add0a10ab2",
    employeeId: "EMP005",
    firstName: "Ren",
    lastName: "Asum",
    email: "Ren@gmail.com",
    phone: "09511431871",
    department: "Dark",
    position: "Dark",
    hireDate: "2025-04-09T00:00:00.000Z",
    salary: 18000,
    status: "Active",
    attendance: [],
    qualifications: ["IT Specialist"],
    licenseNumber: "",
    emergencyContact: {
      name: "Lina Asum",
      relationship: "Sister",
      phone: "09511431872",
    },
    address: "101 Tech Park, City",
    gender: "Male",
    birthDate: "1992-03-25",
    certifications: [],
    shiftPreference: "Day",
    yearsOfService: 1,
  },
  {
    _id: "67f5bcb34466c8838bd23f3e",
    employeeId: "EMP006",
    firstName: "Tyco",
    lastName: "",
    email: "tyco@gmail.com",
    phone: "09511431876",
    department: "Administration",
    position: "Administration",
    hireDate: "2025-04-09T00:00:00.000Z",
    salary: 30000,
    status: "Active",
    attendance: [],
    qualifications: ["MBA", "Hospital Administration"],
    licenseNumber: "",
    emergencyContact: {
      name: "Tina Tyco",
      relationship: "Spouse",
      phone: "09511431877",
    },
    address: "202 Admin Plaza, City",
    gender: "Male",
    birthDate: "1980-09-15",
    certifications: [],
    shiftPreference: "Day",
    yearsOfService: 10,
  },
];

const EmployeeAssistantProgram = ({
  profile = { role: "admin", employeeId: "EMP3" },
}) => {
  const [employeeData] = useState(staticEmployees);
  const [filteredData, setFilteredData] = useState(staticEmployees);
  const [selectedData, setSelectedData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("directory");
  const [ticketData, setTicketData] = useState([]);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "General",
    priority: "Medium",
    description: "",
  });

  const [filters, setFilters] = useState({
    department: "",
    position: "",
    status: "",
    search: "",
    gender: "",
    certification: "",
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
    qualifications: [],
    licenseNumber: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    address: "",
    gender: "Male",
    birthDate: "",
    certifications: [],
    shiftPreference: "Day",
    yearsOfService: 0,
  });

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

    if (filters.gender) {
      result = result.filter(
        (emp) => emp.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    if (filters.certification) {
      result = result.filter((emp) =>
        emp.certifications?.some((cert) =>
          cert.toLowerCase().includes(filters.certification.toLowerCase())
        )
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

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const getUniqueValues = (key) => {
    const unique = new Set(employeeData.map((emp) => emp[key]));
    return Array.from(unique).filter(Boolean).sort();
  };

  const getUniqueCertifications = () => {
    const allCerts = employeeData.flatMap((emp) => emp.certifications || []);
    return Array.from(new Set(allCerts)).sort();
  };

  const resetFilters = () => {
    setFilters({
      department: "",
      position: "",
      status: "",
      search: "",
      gender: "",
      certification: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".");
    setNewEmployeeData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value,
      },
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTicketInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitTicket = () => {
    const newTicketWithMeta = {
      ...newTicket,
      id: `TICKET-${Date.now()}`,
      employeeId: profile.employeeId || "EMP001",
      status: "Open",
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    setTicketData((prev) => [...prev, newTicketWithMeta]);
    setNewTicket({
      subject: "",
      category: "General",
      priority: "Medium",
      description: "",
    });
    alert("Ticket submitted successfully!");
  };

  useEffect(() => {
    if (activeTab === "directory") {
      const table = new DataTable("#myTable", {
        data: filteredData,
        columns: [
          { title: "Employee ID", data: "employeeId" },
          {
            title: "Name",
            data: null,
            render: (data) => `
              <div class="flex items-center">
                <div class="avatar placeholder mr-2">
                  <div class="bg-neutral text-neutral-content rounded-full w-8">
                    <span>${data.firstName.charAt(0)}${data.lastName.charAt(
              0
            )}</span>
                  </div>
                </div>
                <div>
                  <div class="font-medium">${data.firstName} ${
              data.lastName
            }</div>
                  <div class="text-sm text-gray-500">${data.position}</div>
                </div>
              </div>
            `,
          },
          { title: "Department", data: "department" },
          {
            title: "Contact",
            data: null,
            render: (data) => `
              <div>
                <div>${data.email}</div>
                <div class="text-sm text-gray-500">${data.phone}</div>
              </div>
            `,
          },
          {
            title: "Status",
            data: "status",
            render: (data) => `
              <span class="px-2 py-1 rounded-full text-xs ${
                data === "Active"
                  ? "bg-green-100 text-green-800"
                  : data === "Inactive"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }">
                ${data}
              </span>
            `,
          },
          {
            title: "Certifications",
            data: "certifications",
            render: (data) => data?.join(", ") || "None",
          },
          {
            title: "Action",
            data: null,
            render: (data) => `
              <div class="flex space-x-1">
                <button class="btn btn-xs btn-info" id="detailBtn_${data._id}">
                  <i class="fas fa-eye"></i>
                </button>
                ${
                  profile?.role === "superAdmin" || profile?.role === "admin"
                    ? `
                  <button class="btn btn-xs btn-warning" id="editBtn_${data._id}">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-xs btn-error" id="deleteBtn_${data._id}">
                    <i class="fas fa-trash"></i>
                  </button>
                `
                    : ""
                }
              </div>
            `,
          },
        ],
        responsive: true,
        language: {
          emptyTable: "No employees found matching your criteria",
        },
      });

      document.querySelector("#myTable").addEventListener("click", (e) => {
        const detailBtn = e.target.closest('[id^="detailBtn_"]');
        const editBtn = e.target.closest('[id^="editBtn_"]');
        const deleteBtn = e.target.closest('[id^="deleteBtn_"]');

        if (detailBtn) {
          const id = detailBtn.id.split("_")[1];
          const employee = employeeData.find((emp) => emp._id === id);
          setSelectedData(employee);
          setModalType("detail");
          setShowModal(true);
        }

        if (editBtn) {
          const id = editBtn.id.split("_")[1];
          const employee = employeeData.find((emp) => emp._id === id);
          setSelectedData(employee);
          setNewEmployeeData(employee);
          setEditModalOpen(true);
        }

        if (deleteBtn) {
          const id = deleteBtn.id.split("_")[1];
          const employee = employeeData.find((emp) => emp._id === id);
          setSelectedData(employee);
          setModalType("delete");
          setShowModal(true);
        }
      });

      return () => {
        table.destroy();
      };
    }
  }, [filteredData, activeTab]);

  const renderEmployeeDetailModal = () => (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-2xl">
              {selectedData.firstName} {selectedData.lastName}
            </h3>
            <p className="text-gray-500">{selectedData.position}</p>
          </div>
          <span
            className={`badge ${
              selectedData.status === "Active"
                ? "badge-success"
                : selectedData.status === "Inactive"
                ? "badge-error"
                : "badge-warning"
            }`}
          >
            {selectedData.status}
          </span>
        </div>

        <div className="divider"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-lg">Basic Information</h4>
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p>{selectedData.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p>{selectedData.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Birth Date</p>
              <p>{selectedData.birthDate || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Shift Preference</p>
              <p>{selectedData.shiftPreference || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Years of Service</p>
              <p>{selectedData.yearsOfService || "0"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-lg">Contact Information</h4>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{selectedData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p>{selectedData.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p>{selectedData.address || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-lg">Employment Details</h4>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p>{selectedData.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Position</p>
              <p>{selectedData.position}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hire Date</p>
              <p>{new Date(selectedData.hireDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p>₱{selectedData.salary.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-lg">Payroll Information</h4>
            <div>
              <p className="text-sm text-gray-500">Basic Salary</p>
              <p>₱{selectedData.salary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Payment Date</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div className="mt-4">
              <PDFDownloadLink
                document={<PayslipDocument employee={selectedData} />}
                fileName={`payslip_${selectedData.employeeId}_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                className="btn btn-primary btn-sm"
              >
                {({ loading }) =>
                  loading ? "Generating Payslip..." : "Download Payslip"
                }
              </PDFDownloadLink>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={() => setShowModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Assistant Program</h1>
        <div className="flex gap-2">
          {(profile?.role === "superAdmin" || profile?.role === "admin") && (
            <button
              className="btn btn-success"
              onClick={() => setCreateModalOpen(true)}
            >
              <i className="fas fa-plus mr-2"></i>
              Add Employee
            </button>
          )}
        </div>
      </div>

      <div className="tabs tabs-boxed mb-6">
        <button
          className={`tab ${activeTab === "directory" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("directory")}
        >
          <i className="fas fa-address-book mr-2"></i>
          Employee Directory
        </button>
        <button
          className={`tab ${activeTab === "helpdesk" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("helpdesk")}
        >
          <i className="fas fa-question-circle mr-2"></i>
          HR Helpdesk
        </button>   </div>

      {activeTab === "directory" && (
        <>
          <PayrollSystemItem
            data={employeeData}
            title="Employee Overview"
            stats={[
              {
                title: "Total Employees",
                value: employeeData.length,
                change: "+2%",
                icon: "users",
              },
              {
                title: "Active Staff",
                value: employeeData.filter((e) => e.status === "Active").length,
                change: "+5%",
                icon: "user-check",
              },
              {
                title: "Departments",
                value: new Set(employeeData.map((e) => e.department)).size,
                icon: "building",
              },
              {
                title: "Avg Salary",
                value: `₱${Math.round(
                  employeeData.reduce((sum, e) => sum + e.salary, 0) /
                    employeeData.length
                ).toLocaleString()}`,
                icon: "money-bill-wave",
              },
            ]}
          />

          <div className="card bg-base-100 shadow-md my-4">
            <div className="card-body">
              <h2 className="card-title">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Search</span>
                  </label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Name, email or ID"
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Department</span>
                  </label>
                  <select
                    name="department"
                    value={filters.department}
                    onChange={handleFilterChange}
                    className="select select-bordered w-full"
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
                  <label className="label">
                    <span className="label-text">Position</span>
                  </label>
                  <select
                    name="position"
                    value={filters.position}
                    onChange={handleFilterChange}
                    className="select select-bordered w-full"
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
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Certification</span>
                  </label>
                  <select
                    name="certification"
                    value={filters.certification}
                    onChange={handleFilterChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">Any Certification</option>
                    {getUniqueCertifications().map((cert) => (
                      <option key={cert} value={cert}>
                        {cert}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="card-actions justify-end mt-4">
                <button onClick={resetFilters} className="btn btn-outline">
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <table id="myTable" className="display w-full"></table>
            </div>
          </div>
        </>
      )}

      {activeTab === "helpdesk" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-md lg:col-span-1">
            <div className="card-body">
              <h2 className="card-title">Create New Ticket</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Subject</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={newTicket.subject}
                    onChange={handleTicketInputChange}
                    className="input input-bordered"
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select
                    name="category"
                    value={newTicket.category}
                    onChange={handleTicketInputChange}
                    className="select select-bordered"
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Payroll">Payroll Issue</option>
                    <option value="Benefits">Benefits Question</option>
                    <option value="TimeOff">Time Off Request</option>
                    <option value="Technical">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Priority</span>
                  </label>
                  <select
                    name="priority"
                    value={newTicket.priority}
                    onChange={handleTicketInputChange}
                    className="select select-bordered"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={newTicket.description}
                    onChange={handleTicketInputChange}
                    className="textarea textarea-bordered h-32"
                    placeholder="Please provide details about your request..."
                  ></textarea>
                </div>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={submitTicket}
                    disabled={!newTicket.subject || !newTicket.description}
                  >
                    Submit Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md lg:col-span-2">
            <div className="card-body">
              <h2 className="card-title">My Tickets</h2>
              {ticketData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Subject</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketData.map((ticket) => (
                        <tr key={ticket.id}>
                          <td>{ticket.id}</td>
                          <td>{ticket.subject}</td>
                          <td>{ticket.category}</td>
                          <td>
                            <span
                              className={`badge ${
                                ticket.priority === "High"
                                  ? "badge-warning"
                                  : ticket.priority === "Critical"
                                  ? "badge-error"
                                  : "badge-info"
                              }`}
                            >
                              {ticket.priority}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                ticket.status === "Open"
                                  ? "badge-success"
                                  : ticket.status === "Pending"
                                  ? "badge-warning"
                                  : "badge-secondary"
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                          <td>
                            {new Date(ticket.dateCreated).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-ticket-alt text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-500">No tickets submitted yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {createModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl">
            <h3 className="font-bold text-lg">Add New Employee</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-medium">Basic Information</h4>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Employee ID</span>
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={newEmployeeData.employeeId}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="EMP001"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={newEmployeeData.firstName}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={newEmployeeData.lastName}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    name="gender"
                    value={newEmployeeData.gender}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Birth Date</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={newEmployeeData.birthDate}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Shift Preference</span>
                  </label>
                  <select
                    name="shiftPreference"
                    value={newEmployeeData.shiftPreference}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="Day">Day Shift</option>
                    <option value="Night">Night Shift</option>
                    <option value="Rotating">Rotating Shift</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Contact Information</h4>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newEmployeeData.email}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={newEmployeeData.phone}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={newEmployeeData.address}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Employment Details</h4>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Department</span>
                  </label>
                  <select
                    name="department"
                    value={newEmployeeData.department}
                    onChange={handleInputChange}
                    className="select select-bordered"
                    required
                  >
                    <option value="">Select Department</option>
                    {getUniqueValues("department").map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Position</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={newEmployeeData.position}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Hire Date</span>
                  </label>
                  <input
                    type="date"
                    name="hireDate"
                    value={newEmployeeData.hireDate}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    name="status"
                    value={newEmployeeData.status}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Years of Service</span>
                  </label>
                  <input
                    type="number"
                    name="yearsOfService"
                    value={newEmployeeData.yearsOfService}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Professional Details</h4>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Salary ($)</span>
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={newEmployeeData.salary}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">License Number</span>
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={newEmployeeData.licenseNumber}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Qualifications</span>
                  </label>
                  <input
                    type="text"
                    name="qualifications"
                    value={newEmployeeData.qualifications.join(", ")}
                    onChange={(e) => {
                      const quals = e.target.value
                        .split(",")
                        .map((q) => q.trim());
                      setNewEmployeeData((prev) => ({
                        ...prev,
                        qualifications: quals,
                      }));
                    }}
                    className="input input-bordered"
                    placeholder="MD, Board Certified, etc."
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Certifications</span>
                  </label>
                  <input
                    type="text"
                    name="certifications"
                    value={newEmployeeData.certifications.join(", ")}
                    onChange={(e) => {
                      const certs = e.target.value
                        .split(",")
                        .map((c) => c.trim());
                      setNewEmployeeData((prev) => ({
                        ...prev,
                        certifications: certs,
                      }));
                    }}
                    className="input input-bordered"
                    placeholder="ACLS, BLS, PALS, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Emergency Contact</h4>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={newEmployeeData.emergencyContact.name}
                    onChange={handleNestedInputChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Relationship</span>
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.relationship"
                    value={newEmployeeData.emergencyContact.relationship}
                    onChange={handleNestedInputChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={newEmployeeData.emergencyContact.phone}
                    onChange={handleNestedInputChange}
                    className="input input-bordered"
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => {
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
                    qualifications: [],
                    licenseNumber: "",
                    emergencyContact: {
                      name: "",
                      relationship: "",
                      phone: "",
                    },
                    address: "",
                    gender: "Male",
                    birthDate: "",
                    certifications: [],
                    shiftPreference: "Day",
                    yearsOfService: 0,
                  });
                }}
              >
                Cancel
              </button>
              <button className="btn btn-primary">Create Employee</button>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && selectedData && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl">
            <h3 className="font-bold text-lg">
              Edit Employee: {selectedData.firstName} {selectedData.lastName}
            </h3>
            {/* Similar form structure as create modal but with existing data */}
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary">Update Employee</button>
            </div>
          </div>
        </div>
      )}

      {showModal && modalType === "delete" && selectedData && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete {selectedData.firstName}{" "}
              {selectedData.lastName}? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-error">Delete Employee</button>
            </div>
          </div>
        </div>
      )}

      {showModal &&
        modalType === "detail" &&
        selectedData &&
        renderEmployeeDetailModal()}
    </div>
  );
};

export default EmployeeAssistantProgram;
