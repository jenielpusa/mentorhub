const mongoose = require("mongoose");

const GroupNameSchema= new mongoose.Schema(
    {
        groupname: {
            type: String,
            unique: true,
        },
        studentcreated: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("GroupName", GroupNameSchema);
