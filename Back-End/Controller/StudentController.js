const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const mongoose = require("mongoose");
const Student = require("../Models/StudentSchema");
const Apifeatures = require("../Utils/ApiFeatures");
const UserLoginSchema = require("../Models/LogInSchema");
const GroupTitle = require("../Models/GroupNameModelSchema");


exports.DisplayStudent = AsyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = (req.query.search || "").trim();
  const skip = (page - 1) * limit;

  const pipeline = [
    {
      $match: {
        role: { $in: ["student", "member"] }
      }
    },
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

exports.GetMyStudent = AsyncErrorHandler(async (req, res) => {
  try {
    const studentId = req.user.linkId;

    console.log("studentId", studentId)

    if (!studentId) {
      return res.status(400).json({
        error: "No linked student ID found",
      });
    }

    const student = await Student.aggregate([
      // =========================
      // 1. MATCH STUDENT
      // =========================
      {
        $match: {
          _id: new mongoose.Types.ObjectId(studentId),
        },
      },

      // =========================
      // 2. DEPARTMENT LOOKUP
      // =========================
      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true,
        },
      },

      // =========================
      // 3. ADVISER / CO-ADVISER LOOKUP
      // =========================
      {
        $lookup: {
          from: "userloginschemas",
          localField: "AdvicerCoadvicer.user",
          foreignField: "_id",
          as: "adviserUsers",
        },
      },

      // =========================
      // 4. MERGE ADVISER DATA
      // =========================
      {
        $addFields: {
          AdvicerCoadvicer: {
            $map: {
              input: "$AdvicerCoadvicer",
              as: "ac",
              in: {
                role: "$$ac.role",
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$adviserUsers",
                        as: "u",
                        cond: { $eq: ["$$u._id", "$$ac.user"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },

      // =========================
      // 5. REMOVE TEMP FIELD
      // =========================
      {
        $project: {
          adviserUsers: 0,
        },
      },
    ]);

    if (!student.length) {
      return res.status(404).json({
        error: "Student not found",
      });
    }

    return res.json({
      status: "success",
      data: student[0],
    });

  } catch (error) {
    console.error("GetMyStudent Error:", error);

    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
});

exports.GetStudentLead = AsyncErrorHandler(async (req, res) => {
  try {
    const students = await UserLoginSchema.aggregate([
      {
        $match: {
          role: "student",
        },
      },

      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "userloginschemas",
          localField: "AdvicerCoadvicer.user",
          foreignField: "_id",
          as: "adviserUsers",
        },
      }
    ]);

    return res.json({
      status: "success",
      total: students.length,
      data: students,
    });

  } catch (error) {
    console.error("GetMyStudent Error:", error);

    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
});

exports.SelectLead = async (req, res) => {
  try {
    const studentId = req.params.id?.trim();
    const { studentlead } = req.body;
    console.log("studentId:", `"${studentId}"`);
    console.log("studentlead:", `"${studentlead}"`);

    // validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        error: "Invalid Student ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(studentlead)) {
      return res.status(400).json({
        error: "Invalid Student Lead ID",
      });
    }

    // prevent self-lead
    if (studentId === studentlead) {
      return res.status(400).json({
        error: "Student cannot be their own lead",
      });
    }

    // 🔥 DIRECT UPDATE (no need findById + save)
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { studentlead },
      { new: true }
    ).populate("studentlead", "studentID gender");

    // check if student exists
    if (!updatedStudent) {
      return res.status(404).json({
        error: "Student not found",
      });
    }

    await UserLoginSchema.findOneAndUpdate(
      { linkedId: studentId }, // or depende kung ano real link mo
      { studentlead: studentId },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      message: "Student lead assigned successfully",
      data: updatedStudent,
    });

  } catch (error) {
    console.error("SelectLead Error:", error);

    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

exports.getMyGroup = AsyncErrorHandler(async (req, res) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;

    const userId = req.user?.linkId;

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing User ID",
      });
    }

    const result = await Student.aggregate([
      // =====================================================
      // 1. MATCH CURRENT STUDENT (UNCHANGED)
      // =====================================================
      {
        $match: {
          _id: new ObjectId(userId),
        },
      },

      // =====================================================
      // 2. 🔥 NEW: GET STUDENT USER (FOR FULLNAME)
      // =====================================================
      {
        $lookup: {
          from: "userloginschemas",
          localField: "_id",
          foreignField: "linkedId",
          as: "studentUser",
        },
      },
      {
        $unwind: {
          path: "$studentUser",
          preserveNullAndEmptyArrays: true,
        },
      },

      // =====================================================
      // 3. GET LEAD USER (UserLogin)
      // =====================================================
      {
        $lookup: {
          from: "userloginschemas",
          localField: "studentlead",
          foreignField: "_id",
          as: "leadUser",
        },
      },
      {
        $unwind: {
          path: "$leadUser",
          preserveNullAndEmptyArrays: true,
        },
      },

      // =====================================================
      // 4. GET LEAD STUDENT
      // =====================================================
      {
        $lookup: {
          from: "students",
          localField: "leadUser.linkedId",
          foreignField: "_id",
          as: "leadStudent",
        },
      },
      {
        $unwind: {
          path: "$leadStudent",
          preserveNullAndEmptyArrays: true,
        },
      },

      // =====================================================
      // 5. GROUP FROM LEAD STUDENT
      // =====================================================
      {
        $lookup: {
          from: "groupnames",
          localField: "leadStudent.groupId",
          foreignField: "_id",
          as: "groupInfo",
        },
      },
      {
        $unwind: {
          path: "$groupInfo",
          preserveNullAndEmptyArrays: true,
        },
      },

      // =====================================================
      // 6. ADVISERS (KEEP ROLE)
      // =====================================================
      {
        $addFields: {
          adviserList: {
            $ifNull: ["$leadStudent.AdvicerCoadvicer", []],
          },
        },
      },

      {
        $lookup: {
          from: "userloginschemas",
          let: {
            ids: {
              $map: {
                input: "$adviserList",
                as: "a",
                in: "$$a.user",
              },
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$ids"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                username: 1,
                first_name: 1,
                last_name: 1,
              },
            },
          ],
          as: "adviserUsers",
        },
      },

      // =====================================================
      // 7. FINAL OUTPUT
      // =====================================================
      {
        $project: {
          _id: 1,
          studentID: 1,
          dob: 1,
          gender: 1,
          created_at: 1,

          // =================================================
          // 🔥 FIXED STUDENT FULLNAME (NOW WORKING)
          // =================================================
          student: {
            id: "$studentUser._id",
            username: "$studentUser.username",
            fullName: {
              $trim: {
                input: {
                  $concat: [
                    { $ifNull: ["$studentUser.first_name", ""] },
                    " ",
                    { $ifNull: ["$studentUser.last_name", ""] },
                  ],
                },
              },
            },
          },

          group: {
            _id: "$groupInfo._id",
            name: "$groupInfo.groupname",
          },

          studentLead: {
            id: "$leadUser._id",
            username: "$leadUser.username",
            fullName: {
              $trim: {
                input: {
                  $concat: [
                    { $ifNull: ["$leadUser.first_name", ""] },
                    " ",
                    { $ifNull: ["$leadUser.last_name", ""] },
                  ],
                },
              },
            },
          },

          advisers: {
            $map: {
              input: "$adviserList",
              as: "a",
              in: {
                role: "$$a.role",
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$adviserUsers",
                        as: "u",
                        cond: { $eq: ["$$u._id", "$$a.user"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("getMyGroup Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

exports.getMyGroupThesis = AsyncErrorHandler(async (req, res) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;

    const userId = req.body?.userId;

    console.log("userjjjjId",userId)

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing User ID",
      });
    }

    const student = await Student.aggregate([
      // =====================================================
      // 1. CONVERT studentlead STRING -> OBJECTID
      // =====================================================
      {
        $addFields: {
          studentleadObj: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$studentlead", null] },
                  { $ne: ["$studentlead", ""] },
                ],
              },
              then: { $toObjectId: "$studentlead" },
              else: null,
            },
          },
        },
      },

      // =====================================================
      // 2. GET STUDENT USER ACCOUNT
      // =====================================================
      {
        $lookup: {
          from: "userloginschemas",
          localField: "_id",
          foreignField: "linkedId",
          as: "studentUser",
        },
      },
      {
        $unwind: {
          path: "$studentUser",
          preserveNullAndEmptyArrays: true,
        },
      },

      // =====================================================
      // 3. MATCH (GROUP + SELF)
      // =====================================================
      {
        $match: {
          $or: [
            { studentleadObj: new ObjectId(userId) },
            { "studentUser._id": new ObjectId(userId) },
          ],
        },
      },

      // =====================================================
      // 4. DEPARTMENT
      // =====================================================
      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true,
        },
      },

      // =====================================================
      // 5. STUDENT LEAD USER
      // =====================================================
      {
        $lookup: {
          from: "userloginschemas",
          localField: "studentleadObj",
          foreignField: "_id",
          as: "studentLeadUser",
        },
      },
      {
        $unwind: {
          path: "$studentLeadUser",
          preserveNullAndEmptyArrays: true,
        },
      },

      // =====================================================
      // 6. FINAL OUTPUT (NO CO-ADVISER)
      // =====================================================
      {
        $project: {
          _id: 1,
          created_at: 1,

          user: {
            _id: "$_id",
            studentID: "$studentID",
            dob: "$dob",
            gender: "$gender",

            department: {
              _id: "$department._id",
              name: "$department.departmentName",
            },

            account: {
              id: "$studentUser._id",
              username: "$studentUser.username",
              fullName: {
                $trim: {
                  input: {
                    $concat: [
                      { $ifNull: ["$studentUser.first_name", ""] },
                      " ",
                      { $ifNull: ["$studentUser.last_name", ""] },
                    ],
                  },
                },
              },
            },
          },

          studentLead: {
            _id: "$studentLeadUser._id",
            username: "$studentLeadUser.username",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: student.length,
      data: student,
    });

  } catch (error) {
    console.error("getMyGroupThesis Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

exports.fetchAdviser = AsyncErrorHandler(async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID not found" });
    }

    const result = await Student.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },

      // ADVISERS LOOKUP (SAFE VERSION)
      {
        $lookup: {
          from: "userloginschemas",
          let: { advisers: "$AdvicerCoadvicer" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: { $ifNull: ["$$advisers", []] },
                        as: "a",
                        in: {
                          $cond: [
                            { $ne: ["$$a.user", null] },
                            { $toObjectId: "$$a.user" },
                            null,
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                username: 1,
                first_name: 1,
                last_name: 1,
              },
            },
          ],
          as: "fetchedAdviserDetails",
        },
      },

      // BUILD ADVISERS OUTPUT
      {
        $project: {
          _id: 1,
          studentID: 1,

          advisers: {
            $map: {
              input: { $ifNull: ["$AdvicerCoadvicer", []] },
              as: "ac",
              in: {
                role: "$$ac.role",
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$fetchedAdviserDetails",
                        as: "f",
                        cond: {
                          $eq: ["$$f._id", { $toObjectId: "$$ac.user" }],
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },

      // FLATTEN
      {
        $addFields: {
          advisers: {
            $map: {
              input: "$advisers",
              as: "adv",
              in: {
                role: "$$adv.role",
                adviserId: "$$adv.user._id",
                adviserUsername: "$$adv.user.username",
                adviserFullName: {
                  $concat: [
                    { $ifNull: ["$$adv.user.first_name", ""] },
                    " ",
                    { $ifNull: ["$$adv.user.last_name", ""] },
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("fetchAdviser Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});