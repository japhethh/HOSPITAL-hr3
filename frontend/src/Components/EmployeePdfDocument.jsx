// components/EmployeePdfDocument.js
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "right",
  },
  section: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    alignItems: "center",
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomStyle: "solid",
    alignItems: "center",
    paddingVertical: 5,
  },
  cell: {
    padding: 5,
    flex: 1,
    fontSize: 10,
  },
  headerCell: {
    padding: 5,
    flex: 1,
    fontWeight: "bold",
    fontSize: 10,
  },
  footer: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 20,
  },
});

export const EmployeePdfDocument = ({ employees, filters, title }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.subtitle}>
        Generated: {new Date().toLocaleString()}
      </Text>


      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>ID</Text>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Department</Text>
        <Text style={styles.headerCell}>Position</Text>
        <Text style={styles.headerCell}>Email</Text>
        <Text style={styles.headerCell}>Status</Text>
      </View>

      {/* Table Rows */}
      {employees.map((emp, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.cell}>{emp.employeeId}</Text>
          <Text style={styles.cell}>
            {emp.firstName} {emp.lastName}
          </Text>
          <Text style={styles.cell}>{emp.department}</Text>
          <Text style={styles.cell}>{emp.position}</Text>
          <Text style={styles.cell}>{emp.email}</Text>
          <Text style={styles.cell}>{emp.status}</Text>
        </View>
      ))}

      {/* Footer */}
      <Text style={styles.footer}>
        Confidential Employee Data - © {new Date().getFullYear()} Your Company
      </Text>
    </Page>
  </Document>
);
