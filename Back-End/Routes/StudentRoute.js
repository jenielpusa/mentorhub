const express = require("express");
const router = express.Router(); //express router
const StudentController = require("../Controller/StudentController");
const authController = require("../Controller/authController");
const upload = require("../middleware/fileUploader");
router.route("/").get(authController.protect, StudentController.DisplayStudent);

router
  .route("/:id")
  .delete(authController.protect, StudentController.deleteStudent)
  .patch(
    authController.protect,
    upload.single("avatar"),
    StudentController.UpdateStudent,
  );

router
  .route("/UpdateStudentStatusAccount/:id")
  .patch(authController.protect, StudentController.UpdateStudentStatusAccount);

module.exports = router;
