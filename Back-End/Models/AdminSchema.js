const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  avatar: {
    url: String,
    public_id: String,
  },
  id_number: { type: String },
  specialty: { type: String },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
    default: null,
  },
  contact_number:{type:Number},
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", AdminSchema);
