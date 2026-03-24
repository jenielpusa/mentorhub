const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
    unique: true,
  },

  dob: {
    type: String,
  },
  emergency_contact_name: {
    type: String,
  },

  emergency_contact_number: {
    type: Number,
  },

  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", StudentSchema);
