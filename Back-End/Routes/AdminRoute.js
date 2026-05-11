const express = require("express");
const router = express.Router(); //express router
const AdminController = require("../Controller/AdminController");
const authController = require("./../Controller/authController");
const upload = require("../middleware/fileUploader");
router.route("/").get(authController.protect, AdminController.DisplayAdmin);

router
  .route("/DisplayDropdownAdviserPanelist")
  .get(authController.protect, AdminController.DisplayDropdownAdviserPanelist);
router
  .route("/Profile")
  .get(authController.protect, AdminController.DisplayProfile);


router
  .route("/AdminStatusAccount/:id")
  .patch(authController.protect, AdminController.UpdateStudentStatusAccount);

router
  .route("/InsertAdvicerCoAdviser/:id")
  .patch(authController.protect, AdminController.InsertAdvicerCoAdviser);

router
  .route("/DisplayAdviser")
  .get(authController.protect, AdminController.DisplayAdviser);
router
  .route("/:id")
  .delete(authController.protect, AdminController.deleteAdmin)
  .patch(
    authController.protect,
    upload.single("avatar"),
    AdminController.UpdateAdmin,
  );


module.exports = router;
