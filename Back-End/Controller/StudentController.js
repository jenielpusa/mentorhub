const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const Student = require("../Models/StudentSchema");
const Apifeatures = require("../Utils/ApiFeatures");
const UserLoginSchema = require("../Models/LogInSchema");

exports.DisplayStudent = AsyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = (req.query.search || "").trim();
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: { role: "student" } },
    {
      $lookup: {
        from: "students",
        localField: "linkedId",
        foreignField: "_id",
        as: "studentInfo",
      },
    },
    { $unwind: { path: "$studentInfo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "departments",
        localField: "studentInfo.department",
        foreignField: "_id",
        as: "departmentInfo",
      },
    },
    { $unwind: { path: "$departmentInfo", preserveNullAndEmptyArrays: true } },

    // --- DITO ANG MAGIC FIX ---
    ...(search
      ? [
          {
            $addFields: {
              // Gumawa tayo ng virtual "fullName" field para ma-search ang "JENIEL PUSA"
              fullName: { $concat: ["$first_name", " ", "$last_name"] },
            },
          },
          {
            $match: {
              $or: [
                { first_name: { $regex: search, $options: "i" } },
                { last_name: { $regex: search, $options: "i" } },
                { fullName: { $regex: search, $options: "i" } }, // Eto ang sasalo sa "JENIEL PUSA"
                { "studentInfo.studentID": { $regex: search, $options: "i" } },
              ],
            },
          },
        ]
      : []),
    // ---------------------------
  ];

  const students = await UserLoginSchema.aggregate([
    ...pipeline,
    {
      $project: {
        _id: 1,
        first_name: 1,
        middle_name: 1,
        last_name: 1,
        suffix: 1,
        role: 1,
        statusAccount: 1,
        studentID: "$studentInfo.studentID",
        dob: "$studentInfo.dob",
        gender: "$studentInfo.gender",
        department: "$departmentInfo.departmentName",
        emergency_contact_name: "$studentInfo.emergency_contact_name",
        emergency_contact_number: "$studentInfo.emergency_contact_number",
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  const totalCountResult = await UserLoginSchema.aggregate([
    ...pipeline,
    { $count: "total" },
  ]);
  const totalCount = totalCountResult[0]?.total || 0;

  res.status(200).json({
    status: "success",
    totalCount,
    data: students,
  });
});

exports.deleteStudent = AsyncErrorHandler(async (req, res, next) => {
  const StudentID = req.params.id;
  const userLogin = await UserLoginSchema.findOne({ linkedId: StudentID });
  if (userLogin) {
    await UserLoginSchema.findByIdAndDelete(userLogin._id);
  }
  const deleteStudent = await Student.findByIdAndDelete(StudentID);
  if (!deleteStudent) {
    return res.status(404).json({
      status: "fail",
      message: "Student not found.",
    });
  }
  res.status(200).json({
    status: "success",
    message: "Student and related login deleted successfully.",
    data: null,
  });
});

exports.UpdateStudent = AsyncErrorHandler(async (req, res, next) => {
  const updateStudent = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  res.status(200).json({
    status: "success",
    data: updateStudent,
  });
});

exports.UpdateStudentStatusAccount = AsyncErrorHandler(
  async (req, res, next) => {
    const io = req.app.get("socketio");
    const { statusAccount } = req.body;
    console.log("statusAccount", statusAccount);
    const updatedUser = await UserLoginSchema.findOneAndUpdate(
      { _id: req.params.id },
      { statusAccount },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
      });
    }
    
    if (io) {
      const roomName = "admin-private-room";
      const payload = {
        userId: updatedUser._id,
        newStatus: updatedUser.statusAccount
      };
      io.to(roomName).emit("admin:account-status-updated", payload);
    }

    res.status(200).json({
      status: true,
      data: updatedUser,
    });
  },
);
