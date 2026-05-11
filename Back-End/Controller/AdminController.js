const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const Admin = require("../Models/AdminSchema");
const UserLoginSchema = require("../Models/LogInSchema");
const fs = require("fs");
const axios = require("axios");
const { URLSearchParams } = require("url");
const FormData = require("form-data");
const Student = require("../Models/StudentSchema")
exports.deleteAdmin = AsyncErrorHandler(async (req, res, next) => {
  const AdminID = req.params.id;

  const existingAdmin = await Admin.findById(AdminID);
  if (!existingAdmin) {
    return res.status(404).json({
      status: "fail",
      message: "Admin not found.",
    });
  }

  // Hakbang 1: Tanggalin ang admin record at ang UserLogin record
  const userLogin = await UserLoginSchema.findOne({ linkedId: AdminID });
  if (userLogin) {
    await UserLoginSchema.findByIdAndDelete(userLogin._id);
  }

  await Admin.findByIdAndDelete(AdminID);

  // Hakbang 2: Agad na magbigay ng success response sa user
  res.status(200).json({
    status: "success",
    message: "Admin and related login deleted successfully.",
    data: null,
  });

  // Hakbang 3: I-delete ang avatar file sa background
  if (existingAdmin.avatar && existingAdmin.avatar.url) {
    const avatarUrl = existingAdmin.avatar.url;

    // "Fire and forget" ang delete request
    const params = new URLSearchParams();
    params.append("file", avatarUrl);

    axios
      .post(
        "https://bp-sangguniangpanlalawigan.com/delete.php",
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      )
      .then((response) => {
        if (response.data.success) {
          console.log(
            "Avatar deleted from Hostinger in background:",
            avatarUrl,
          );
        } else {
          console.error(
            "Failed to delete avatar from Hostinger in background:",
            response.data.message,
          );
        }
      })
      .catch((error) => {
        console.error(
          "Error deleting avatar from Hostinger in background:",
          error.message,
        );
      });
  }
});

exports.DisplayAdmin = AsyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = (req.query.search || "").trim();
  const roleQuery = (req.query.role || "").toLowerCase();
  const skip = (page - 1) * limit;

  const pipeline = [
    {
      // 1. Filter base sa role (Default: lahat maliban sa student)
      $match: roleQuery
        ? { role: { $regex: `^${roleQuery}$`, $options: "i" } }
        : { role: { $ne: "student" } },
    },
    {
      // 2. Lookup sa Admin collection (Dito nakatali ang linkedId)
      $lookup: {
        from: "admins", // Siguraduhin na "admins" ang pangalan ng collection sa DB
        localField: "linkedId",
        foreignField: "_id",
        as: "adminProfile",
      },
    },
    { $unwind: { path: "$adminProfile", preserveNullAndEmptyArrays: true } },

    {
      // 3. Nested Lookup: Kunin ang Department name mula sa loob ng Admin profile
      $lookup: {
        from: "departments",
        localField: "adminProfile.department",
        foreignField: "_id",
        as: "deptInfo",
      },
    },
    { $unwind: { path: "$deptInfo", preserveNullAndEmptyArrays: true } },

    ...(search
      ? [
        {
          $addFields: {
            fullName: { $concat: ["$first_name", " ", "$last_name"] },
          },
        },
        {
          $match: {
            $or: [
              { first_name: { $regex: search, $options: "i" } },
              { last_name: { $regex: search, $options: "i" } },
              { fullName: { $regex: search, $options: "i" } },
              {
                "deptInfo.departmentName": { $regex: search, $options: "i" },
              },
              { "adminProfile.id_number": { $regex: search, $options: "i" } },
            ],
          },
        },
      ]
      : []),
  ];

  const users = await UserLoginSchema.aggregate([
    ...pipeline,
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        first_name: 1,
        middle_name: 1,
        last_name: 1,
        suffix: 1,
        role: 1,
        statusAccount: 1,
        email: "$username",
        // Kinukuha ang data mula sa joined collections
        contact_number: "$adminProfile.contact_number",
        id_number: "$adminProfile.id_number",
        specialty: "$adminProfile.specialty",
        department: "$deptInfo.departmentName",
        avatar: { $ifNull: ["$avatar", "$adminProfile.avatar"] }, // Fallback avatar
      },
    },
  ]);

  const totalCountResult = await UserLoginSchema.aggregate([
    ...pipeline,
    { $count: "total" },
  ]);
  const totalCount = totalCountResult[0]?.total || 0;

  res.status(200).json({
    status: "success",
    totalCount,
    data: users,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
  });
});

exports.DisplayProfile = AsyncErrorHandler(async (req, res) => {
  const loggedInAdminId = req.user.linkId;
  const admin = await Admin.findById(loggedInAdminId);
  if (!admin) {
    return res.status(404).json({
      status: "fail",
      message: "Admin not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: admin,
  });
});

exports.UpdateAdmin = AsyncErrorHandler(async (req, res) => {
  console.log("Received file:", req.file);
  console.log("Received data:", req.body);
  const adminId = req.params.id;

  const oldRecord = await Admin.findById(adminId);
  if (!oldRecord) {
    return res.status(404).json({ error: "Admin not found" });
  }

  let newAvatarUrl = oldRecord.avatar ? oldRecord.avatar.url : null;
  const oldAvatarUrl = oldRecord.avatar ? oldRecord.avatar.url : null;

  if (req.file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete invalid temp file:", err);
      });
      return res.status(400).json({ error: "Invalid image type" });
    }
  }

  try {
    if (req.file) {
      const form = new FormData();
      form.append("file", fs.createReadStream(req.file.path), {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const uploadResponse = await axios.post(
        "https://bp-sangguniangpanlalawigan.com/upload.php",
        form,
        {
          headers: form.getHeaders(),
          maxBodyLength: Infinity,
        },
      );

      if (!uploadResponse.data.success) {
        throw new Error(
          uploadResponse.data.message || "Failed to upload new avatar",
        );
      }

      newAvatarUrl = uploadResponse.data.url;
      console.log("New avatar uploaded:", newAvatarUrl);
    }

    const updateData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      middle_name: req.body.middle_name,
      email: req.body.email,
      gender: req.body.gender,
    };

    if (req.file) {
      updateData.avatar = {
        ...oldRecord.avatar,
        url: newAvatarUrl,
      };
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({ error: "Admin not found after update" });
    }

    res.json({ status: "success", data: updatedAdmin });

    if (req.file && oldAvatarUrl) {
      const params = new URLSearchParams();
      params.append("file", oldAvatarUrl);

      axios
        .post(
          "https://bp-sangguniangpanlalawigan.com/delete.php",
          params.toString(),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
        )
        .then((response) => {
          if (response.data.success) {
            console.log("Old news image deleted in background:", oldAvatarUrl);
          } else {
            console.error(
              "Failed to delete old news image in background:",
              response.data.message,
            );
          }
        })
        .catch((error) => {
          console.error(
            "Error deleting old news image in background:",
            error.message,
          );
        });
    }
  } catch (error) {
    console.error("UpdateAdmin Error:", error);
    res.status(500).json({ error: "Something went wrong." });
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }
  }
});

exports.UpdateStudentStatusAccount = AsyncErrorHandler(
  async (req, res, next) => {
    try {
      const io = req.app.get("socketio");
      const { statusAccount } = req.body;

      // kapag hindi na pending automatic verified
      const isVerified = statusAccount !== "pending";

      const updatedUser = await UserLoginSchema.findOneAndUpdate(
        { _id: req.params.id },
        {
          statusAccount,
          isVerified
        },
        { new: true }
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
          newStatus: updatedUser.statusAccount,
        };

        io.to(roomName).emit("admin:account-status-updated", payload);
      }

      res.status(200).json({
        status: true,
        data: updatedUser,
      });

    } catch (error) {
      console.error("Error updating student status:", error);
      res.status(500).json({
        status: "error",
        message: "Something went wrong while updating the account",
        error: error.message,
      });
    }
  }
);

exports.DisplayDropdownAdviserPanelist = AsyncErrorHandler(async (req, res) => {

  const pipeline = [
    {
      $match: {
        role: { $in: ["adviser", "panelist"] }
      }
    },

    {
      $lookup: {
        from: "admins",
        localField: "linkedId",
        foreignField: "_id",
        as: "adminProfile",
      },
    },

    {
      $unwind: {
        path: "$adminProfile",
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $lookup: {
        from: "departments",
        localField: "adminProfile.department",
        foreignField: "_id",
        as: "deptInfo",
      },
    },

    {
      $unwind: {
        path: "$deptInfo",
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $project: {
        _id: 1,
        first_name: 1,
        middle_name: 1,
        last_name: 1,
        suffix: 1,
        role: 1,
        statusAccount: 1,
        email: "$username",

        contact_number: "$adminProfile.contact_number",
        id_number: "$adminProfile.id_number",
        specialty: "$adminProfile.specialty",
        department: "$deptInfo.departmentName",

        avatar: { $ifNull: ["$avatar", "$adminProfile.avatar"] }
      }
    },

    {
      $sort: { createdAt: -1 }
    }

  ];

  const users = await UserLoginSchema.aggregate(pipeline);

  res.status(200).json({
    status: "success",
    totalCount: users.length,
    data: users
  });

});

exports.DisplayAdviser = AsyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = (req.query.search || "").trim();
  const skip = (page - 1) * limit;

  const pipeline = [
    {
      $match: {
        role: {
          $in: ["adviser", "panelist"],
        },
      },
    },

    {
      // Lookup sa admins collection
      $lookup: {
        from: "admins",
        localField: "linkedId",
        foreignField: "_id",
        as: "adminProfile",
      },
    },

    {
      $unwind: {
        path: "$adminProfile",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      // Lookup sa department
      $lookup: {
        from: "departments",
        localField: "adminProfile.department",
        foreignField: "_id",
        as: "deptInfo",
      },
    },

    {
      $unwind: {
        path: "$deptInfo",
        preserveNullAndEmptyArrays: true,
      },
    },

    // Search functionality
    ...(search
      ? [
        {
          $addFields: {
            fullName: {
              $concat: ["$first_name", " ", "$last_name"],
            },
          },
        },

        {
          $match: {
            $or: [
              {
                first_name: {
                  $regex: search,
                  $options: "i",
                },
              },

              {
                last_name: {
                  $regex: search,
                  $options: "i",
                },
              },

              {
                fullName: {
                  $regex: search,
                  $options: "i",
                },
              },

              {
                "deptInfo.departmentName": {
                  $regex: search,
                  $options: "i",
                },
              },

              {
                "adminProfile.id_number": {
                  $regex: search,
                  $options: "i",
                },
              },
            ],
          },
        },
      ]
      : []),
  ];

  // Main data
  const users = await UserLoginSchema.aggregate([
    ...pipeline,

    {
      $sort: {
        createdAt: -1,
      },
    },

    {
      $skip: skip,
    },

    {
      $limit: limit,
    },

    {
      $project: {
        _id: 1,
        first_name: 1,
        middle_name: 1,
        last_name: 1,
        suffix: 1,
        role: 1,
        statusAccount: 1,

        email: "$username",

        contact_number: "$adminProfile.contact_number",

        id_number: "$adminProfile.id_number",

        specialty: "$adminProfile.specialty",

        department: "$deptInfo.departmentName",

        avatar: {
          $ifNull: ["$avatar", "$adminProfile.avatar"],
        },
      },
    },
  ]);

  // Total count
  const totalCountResult = await UserLoginSchema.aggregate([
    ...pipeline,
    {
      $count: "total",
    },
  ]);

  const totalCount = totalCountResult[0]?.total || 0;

  res.status(200).json({
    status: "success",
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    data: users,
  });
});


exports.InsertAdvicerCoAdviser = AsyncErrorHandler(async (req, res) => {
  try {
    const studentId = req.params.id;

    console.log("req.body",req.body)

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        error: "Student not found",
      });
    }

    const { adviser, coAdviser } = req.body;

    if (!adviser || !coAdviser) {
      return res.status(400).json({
        error: "Adviser and Co-Adviser are required",
      });
    }

    student.AdvicerCoadvicer = student.AdvicerCoadvicer.filter(
      (item) => item.role !== "Adviser" && item.role !== "Co-Adviser"
    );

    student.AdvicerCoadvicer.push(
      {
        user: adviser,
        role: "Adviser",
      },
      {
        user: coAdviser,
        role: "Co-Adviser",
      }
    );


    const updatedStudent = await student.save();

    return res.json({
      status: "success",
      data: updatedStudent,
    });

  } catch (error) {
    console.error("InsertAdvicerCoAdviser Error:", error);

    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
});