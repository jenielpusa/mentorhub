const express = require("express");
const router = express.Router(); //express router
const DepartmentController = require("../Controller/DepartmentController");
const authController = require("./../Controller/authController");
const upload = require("../middleware/fileUploader");
router
  .route("/")
  .get(DepartmentController.getAllDepartments)
  .post(authController.protect, DepartmentController.createDepartment);

router
  .route("/:id")
  .delete(authController.protect, DepartmentController.deleteDepartment)
  .patch(authController.protect, DepartmentController.updateDepartment);

module.exports = router;
