const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const ProposalModel = require("./../Models/DocumentsSchema");
const Notification = require("../Models/NotificationSchema");
const path = require("path");
const cloudinary = require("../Utils/cloudinary");
const streamifier = require("streamifier");
const mongoose = require("mongoose");
const axios = require("axios");

exports.createProposal = AsyncErrorHandler(async (req, res, next) => {
  try {
    const {
      title,
      description,
      remarks,
      status = "pending",
      adviserId,
      coAdviserId,
    } = req.body;

    console.log("req.body", req.body);

    let fileData = {};

    // Handle file upload
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const baseName = path.basename(req.file.originalname, ext);
      const uniqueFileName = `${Date.now()}_${baseName}`;

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "Event Proposals",
            resource_type: "raw",
            public_id: uniqueFileName,
          },
          (err, res) => (err ? reject(err) : resolve(res)),
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      fileData = {
        fileUrl: result.secure_url,
        fileName: req.file.originalname,
        publicId: result.public_id,
        fileType: req.file.mimetype,
      };
    }

    // Create proposal with adviser and co-adviser
    const proposal = await ProposalModel.create({
      title,
      description,
      remarks,
      submitted_by: req.user.linkId,
      adviserId,
      coAdviserId,
      status,
      ...fileData,
    });

    res.status(201).json({
      status: true,
      data: proposal,
    });
  } catch (error) {
    console.error("Create Proposal Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create proposal",
      error: error.message,
    });
  }
});

exports.DisplayProposal = AsyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const { search, status, dateFrom, dateTo } = req.query;

  const role = req.user.role;
  const userId = req.user.linkId;

  const matchStage = {};

  // 🔹 Role filter
  if (role === "organizer") {
    matchStage.submitted_by = new mongoose.Types.ObjectId(userId);
  }

  // 🔹 Search
  if (search) {
    matchStage.title = { $regex: search.trim(), $options: "i" };
  }

  // 🔹 Status filter
  if (status) {
    matchStage.status = status;
  }

  // 🔹 Date filter
  if (dateFrom || dateTo) {
    matchStage.created_at = {};

    if (dateFrom) {
      matchStage.created_at.$gte = new Date(dateFrom);
    }

    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      matchStage.created_at.$lte = endOfDay;
    }
  }

  const result = await ProposalModel.aggregate([
    { $match: matchStage },

    // 🔹 ORGANIZER (submitted_by)
    {
      $lookup: {
        from: "students", // check mo kung tama
        localField: "submitted_by",
        foreignField: "_id",
        as: "organizerInfo",
      },
    },

    // 🔹 ADVISER
    {
      $lookup: {
        from: "userloginschemas",
        localField: "adviserId",
        foreignField: "_id",
        as: "adviserInfo",
      },
    },

    // 🔹 CO-ADVISER
    {
      $lookup: {
        from: "userloginschemas",
        localField: "coAdviserId",
        foreignField: "_id",
        as: "coAdviserInfo",
      },
    },

    // 🔹 UNWIND (safe)
    {
      $unwind: {
        path: "$organizerInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$adviserInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$coAdviserInfo",
        preserveNullAndEmptyArrays: true,
      },
    },

    // 🔹 SORT
    { $sort: { created_at: -1 } },

    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },

          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              status: 1,
              remarks: 1,
              created_at: 1,
              fileName: 1,
              fileUrl: 1,

              // 🔥 ORGANIZER NAME
              organizerName: {
                $ifNull: [
                  {
                    $concat: [
                      "$organizerInfo.first_name",
                      " ",
                      "$organizerInfo.last_name",
                    ],
                  },
                  "N/A",
                ],
              },

              // ⚠️ ADMIN WALANG NAME → fallback muna
              adviserName: {
                $ifNull: [
                  "$adviserInfo.id_number",
                  "N/A",
                ],
              },

              coAdviserName: {
                $ifNull: [
                  "$coAdviserInfo.id_number",
                  "N/A",
                ],
              },

              // 🔹 optional full objects (kung kailangan mo sa frontend)
              organizerInfo: 1,
              adviserInfo: 1,
              coAdviserInfo: 1,
            },
          },
        ],

        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const proposals = result[0].data || [];
  const totalCount = result[0].totalCount[0]?.count || 0;

  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    status: "success",
    currentPage: page,
    totalPages,
    totalCount,
    results: proposals.length,
    data: proposals,
  });
});

exports.UpdateProposal = AsyncErrorHandler(async (req, res) => {
  const { status, submitted_by } = req.body;

  const proposal = await ProposalModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );

  if (!proposal) {
    return res.status(404).json({
      status: "fail",
      message: "Proposal not found",
    });
  }

  const io = req.app.get("io");

  const message = {
    message: `Your proposal has been ${status}`,
    data: proposal,
  };

  if (submitted_by) {
    const targetUser = global.connectedUsers?.[submitted_by.toString()];

    if (targetUser) {
      io.to(targetUser.socketId).emit("ApprovedProposal", message);
    }

    await Notification.create({
      message: message.message,
      title: "Proposal Status Update",
      category: "Proposal",
      priority: "high",
      viewers: [
        {
          user: new mongoose.Types.ObjectId(submitted_by),
          isRead: false,
        },
      ],
    });
  }

  res.status(200).json({
    status: "success",
    data: proposal,
  });
});

exports.deleteProposal = AsyncErrorHandler(async (req, res) => {
  const proposal = await ProposalModel.findById(req.params.id);

  if (!proposal) {
    return res.status(404).json({
      status: "fail",
      message: "Proposal not found.",
    });
  }

  if (proposal.publicId) {
    await cloudinary.uploader.destroy(proposal.publicId, {
      resource_type: "raw",
    });
  }

  await ProposalModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Proposal deleted successfully.",
  });
});

exports.getFileCloud = AsyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const file = await ProposalModel.findById(id);

  if (!file) {
    return res.status(404).json({ message: "File not found." });
  }

  const response = await axios({
    method: "GET",
    url: file.fileUrl,
    responseType: "stream",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${file.fileName}"`);

  return response.data.pipe(res);
});
