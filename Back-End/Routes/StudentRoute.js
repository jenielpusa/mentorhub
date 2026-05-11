const express = require("express");
const router = express.Router(); //express router
const StudentController = require("../Controller/StudentController");
const authController = require("../Controller/authController");
const upload = require("../middleware/fileUploader");
router.route("/").get(authController.protect, StudentController.DisplayStudent);

router
  .route("/:id")
  .delete (authController.protect, StudentController.deleteStudent)
  .patch(
    authController.protect,
    upload.single("avatar"),
    StudentController.UpdateStudent,
  )

router
  .route("/GetMyStudent")
  .get(authController.protect, StudentController.GetMyStudent)

router
  .route("/GetStudentLead")
  .get(authController.protect, StudentController.GetStudentLead)
router
  .route("/getMyGroup")
  .get(authController.protect, StudentController.getMyGroup)

router
  .route("/getMyGroupThesis")
  .post(authController.protect, StudentController.getMyGroupThesis)
router
  .route("/fetchAdviser/:id")
  .get(authController.protect, StudentController.fetchAdviser)

router
  .route("/UpdateStudentStatusAccount/:id")
  .patch(authController.protect, StudentController.UpdateStudentStatusAccount);

router
  .route("/SelectLead/:id")
  .patch(authController.protect, StudentController.SelectLead);

module.exports = router;
