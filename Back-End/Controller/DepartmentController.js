const Department = require("../Models/DepartmentSchema");

// CREATE Department
exports.createDepartment = async (req, res) => {
  try {
    const { departmentName, description } = req.body;

    if (!departmentName) {
      return res.status(400).json({
        status: "failed",
        message: "Department name is required",
      });
    }

    const existing = await Department.findOne({ departmentName });

    if (existing) {
      return res.status(409).json({
        status: "failed",
        message: "Department already exists",
      });
    }

    const department = await Department.create({
      departmentName,
      description,
    });

    res.status(201).json({
      status: "success",
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

// GET All Departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: departments.length,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

// GET Single Department
exports.getSingleDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        status: "failed",
        message: "Department not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

// UPDATE Department
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!department) {
      return res.status(404).json({
        status: "failed",
        message: "Department not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

// DELETE Department
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        status: "failed",
        message: "Department not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};