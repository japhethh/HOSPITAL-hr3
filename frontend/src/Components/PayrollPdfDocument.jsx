// Components/PayrollPdfDocument.js
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  tableCol: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  headerText: {
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
  },
});

export const PayrollPdfDocument = ({ payrollData, filters, title }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          Generated on: {new Date().toLocaleDateString()}
        </Text>
        {filters && (
          <Text style={styles.subtitle}>
            Filters:{" "}
            {Object.entries(filters)
              .filter(([_, value]) => value)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </Text>
        )}
      </View>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Employee ID</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Name</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Department</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Position</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Salary</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Leave</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Status</Text>
          </View>
        </View>

        {/* Table Rows */}
        {payrollData.map((employee, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text>{employee.employeeId || "N/A"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{employee.name || "N/A"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{employee.department || "N/A"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{employee.position || "N/A"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{employee.salary ? `${employee.salary}` : "N/A"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{employee.leave || "N/A"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{employee.status || "N/A"}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>
          Confidential Payroll Data - © {new Date().getFullYear()} Your Company
        </Text>
      </View>
    </Page>
  </Document>
);
