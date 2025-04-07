// Components/AttendancePdfDocument.js
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

export const AttendancePdfDocument = ({ attendanceData, filters, title }) => (
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
            <Text style={styles.headerText}>Date</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Clock In</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Clock Out</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Total Hours</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Status</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Department</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Remarks</Text>
          </View>
        </View>

        {/* Table Rows */}
        {attendanceData.map((record, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text>{record.employeeId || "N/A"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>
                {record.date
                  ? new Date(record.date).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{record.clockIn || "N/A"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{record.clockOut || "N/A"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{record.totalHours || "0"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{record.status || "N/A"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{record.department || "N/A"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{record.remarks || "N/A"}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>
          Confidential Attendance Data - © {new Date().getFullYear()} Your
          Company
        </Text>
      </View>
    </Page>
  </Document>
);
