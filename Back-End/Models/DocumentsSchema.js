const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  fileUrl: {
    type: String,
    default: null,
  },
  note: {
    type: String,
  },
  fileName: {
    type: String,
    default: null,
  },
  remarks: String,
  submitted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },

  adviserId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  coAdviserId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", documentSchema);
