const mongoose = require("mongoose");

const PayrollSystemSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    position: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    salary: { type: Number, required: true },
    hireDate: { type: Date, required: true },
    status: { type: String, required: true },
});

module.exports = mongoose.model("PayrollSystem", PayrollSystemSchema);