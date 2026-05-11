const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const GroupName = require("../Models/GroupNameModelSchema");
const mongoose = require("mongoose");
const Student = require("../Models/StudentSchema")

exports.createGroup = AsyncErrorHandler(async (req, res, next) => {
    try {
        // 1. Extract data mula sa request
        const groupname = req.body?.groupname?.groupName;
        const studentId = req.user?.linkId; // Ito ang _id ng Student

        console.log("Processing update for Student ID:", studentId);

        // 2. Validation: Siguraduhing may group name
        if (!groupname) {
            return res.status(400).json({
                status: "failed",
                message: "Group name is required",
            });
        }

        // 3. Check kung may kaparehong group name na sa system (Global Uniqueness)
        const existingGroupName = await GroupName.findOne({ groupname });

        if (existingGroupName) {
            return res.status(409).json({
                status: "failed",
                message: "Group name already exists. Please choose another.",
            });
        }

        // 4. Check kung ang student na ito ay may dati nang ginawang group
        const existingStudentGroup = await GroupName.findOne({
            studentcreated: studentId,
        });

        let group;

        if (existingStudentGroup) {
            // Update ang pangalan ng dating group kung meron na
            group = await GroupName.findByIdAndUpdate(
                existingStudentGroup._id,
                { groupname },
                { new: true, runValidators: true }
            );
        } else {
            // Gumawa ng bagong group kung wala pa
            group = await GroupName.create({
                groupname,
                studentcreated: studentId,
            });
        }

        // 5. 🔥 FIX: I-update ang Student document gamit ang _id
        // Ginagamit ang findByIdAndUpdate dahil studentId ang primary key (_id)
        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { $set: { groupId: group._id } },
            { new: true, runValidators: true }
        );

        // Log para sa debugging
        if (!updatedStudent) {
            console.log("❌ Update Failed: Walang nahanap na Student gamit ang ID:", studentId);
            return res.status(404).json({
                status: "failed",
                message: "Student record not found.",
            });
        }

        console.log("✅ UPDATE SUCCESS:", updatedStudent);

        // 6. Send Response
        return res.status(201).json({
            status: "success",
            message: existingStudentGroup
                ? "Group updated successfully"
                : "Group created successfully",
            data: {
                group,
                student: updatedStudent
            },
        });

    } catch (error) {
        console.error("Create Group Error:", error);
        return res.status(500).json({
            status: "failed",
            message: error.message || "Internal server error",
        });
    }
});


// GET ALL GROUPS (WITH LOOKUP)
exports.getAllGroups = AsyncErrorHandler(async (req, res, next) => {

    const groups = await GroupName.aggregate([
        {
            $sort: { createdAt: -1 },
        },

        {
            $lookup: {
                from: "students",
                localField: "studentcreated",
                foreignField: "_id",
                as: "studentInfo",
            },
        },

        {
            $unwind: {
                path: "$studentInfo",
                preserveNullAndEmptyArrays: true,
            },
        },

        {
            $project: {
                _id: 1,
                groupname: 1,
                createdAt: 1,
                studentcreated: 1,

                // Student fields based sa schema mo
                studentID: "$studentInfo.studentID",
                gender: "$studentInfo.gender",
                dob: "$studentInfo.dob",
                emergency_contact_name: "$studentInfo.emergency_contact_name",
                emergency_contact_number: "$studentInfo.emergency_contact_number",

                department: "$studentInfo.department",
            },
        },
    ]);

    res.status(200).json({
        status: "success",
        results: groups.length,
        data: groups,
    });
});
exports.getSingleGroup = AsyncErrorHandler(async (req, res, next) => {
    try {
        const userId = req.user?.linkId;

        console.log("userId:", userId);

        // ❗ validate userId first
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid user ID",
            });
        }

        const group = await GroupName.aggregate([
            {
                $match: {
                    studentcreated: new mongoose.Types.ObjectId(userId),
                },
            },

            {
                $lookup: {
                    from: "students",
                    localField: "studentcreated",
                    foreignField: "_id",
                    as: "studentInfo",
                },
            },

            {
                $unwind: {
                    path: "$studentInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $project: {
                    _id: 1,
                    groupname: 1,
                    createdAt: 1,
                    studentcreated: 1,

                    // student info
                    studentID: "$studentInfo.studentID",
                    gender: "$studentInfo.gender",
                    dob: "$studentInfo.dob",
                    emergency_contact_name: "$studentInfo.emergency_contact_name",
                    emergency_contact_number: "$studentInfo.emergency_contact_number",
                    department: "$studentInfo.department",
                },
            },
        ]);

        if (!group || group.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "No group found for this user",
            });
        }

        res.status(200).json({
            status: "success",
            data: group[0], // since isa lang expected
        });

    } catch (error) {
        console.error("Get Group Error:", error);

        return res.status(500).json({
            status: "failed",
            message: error.message || "Internal server error",
        });
    }
});


// UPDATE GROUP
exports.updateGroup = AsyncErrorHandler(async (req, res, next) => {
    const group = await GroupName.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!group) {
        return res.status(404).json({
            status: "failed",
            message: "Group not found",
        });
    }

    res.status(200).json({
        status: "success",
        data: group,
    });
});


// DELETE GROUP
exports.deleteGroup = AsyncErrorHandler(async (req, res, next) => {
    const group = await GroupName.findByIdAndDelete(req.params.id);

    if (!group) {
        return res.status(404).json({
            status: "failed",
            message: "Group not found",
        });
    }

    res.status(200).json({
        status: "success",
        message: "Group deleted successfully",
    });
});