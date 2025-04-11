const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController");
const cron = require("node-cron");

// Schedule monthly payroll processing (runs on 1st of every month at 3 AM)
cron.schedule(
  "0 3 1 * *",
  async () => {
    console.log("Running monthly payroll processing...");
    const now = new Date();
    const result = await payrollController.processMonthlyPayroll(
      now.getFullYear(),
      now.getMonth()
    );
    console.log("Payroll processing result:", result.message);
  },
  {
    scheduled: true,
    timezone: "Asia/Manila", // Adjust to your timezone
  }
);

// Get all payroll records
router.get("/", async (req, res) => {
  const result = await payrollController.getAllPayrolls();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ message: result.message });
  }
});

// Get payroll by ID
router.get("/:id", async (req, res) => {
  const result = await payrollController.getPayrollById(req.params.id);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(404).json({ message: result.message });
  }
});

// Manually trigger payroll processing (for testing)
router.post("/process", async (req, res) => {
  const { year, month } = req.body;
  const result = await payrollController.processMonthlyPayroll(
    year || new Date().getFullYear(),
    month || new Date().getMonth()
  );

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

module.exports = router;
