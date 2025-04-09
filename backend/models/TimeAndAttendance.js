const mongoose = require("mongoose");

const TimeAndAttendanceSchema = new mongoose.Schema({
  employeeId: { 
    type: String, 
    required: true,
    index: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  clockIn: { 
    type: Date, 
    required: true 
  },
  clockOut: { 
    type: Date 
  },
  totalHours: { 
    type: Number,
    min: 0,
    validate: {
      validator: function(v) {
        return typeof v === 'number' && !isNaN(v);
      },
      message: props => `${props.value} is not a valid number for totalHours`
    }
  },
  status: { 
    type: String, 
    enum: ["Present", "Completed", "Short Hours", "Absent"],
    default: "Present"
  },
  remarks: { 
    type: String 
  },
  department: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

// Add index for better query performance
TimeAndAttendanceSchema.index({ employeeId: 1, date: 1 });

module.exports = mongoose.model("TimeAndAttendance", TimeAndAttendanceSchema);