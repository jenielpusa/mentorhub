const express = require("express");
const router = express.Router(); //express router
const GroupNameController = require("../Controller/GroupNameController");
const authController = require("./../Controller/authController");
const upload = require("../middleware/fileUploader");
router
  .route("/")
  .get(authController.protect,GroupNameController.getAllGroups)
  .post(authController.protect, GroupNameController.createGroup);
router
  .route("/Singlegroup")
  .get(authController.protect,GroupNameController.getSingleGroup)

router
  .route("/:id")
  .delete(authController.protect, GroupNameController.deleteGroup)
  .patch(authController.protect, GroupNameController.updateGroup);

module.exports = router;
