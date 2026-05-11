const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
    unique: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupName",
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

  studentlead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
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
  AdvicerCoadvicer: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserLoginSchema",
      },

      role: {
        type: String,
        enum: ["Adviser", "Co-Adviser"],
        required: true,
      },
    },
  ],

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", StudentSchema);