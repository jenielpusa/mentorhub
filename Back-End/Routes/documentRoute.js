const express = require('express');
const router = express.Router();//express router
const Proposal=require('./../Controller/DocumentController')
const authController = require('./../Controller/authController')
const upload = require("../middleware/fileUploader");
router.route('/')
    .post(authController.protect,upload.single("file"),Proposal.createProposal)
    .get(authController.protect,Proposal.DisplayProposal)

module.exports=router