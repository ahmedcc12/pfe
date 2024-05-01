const express = require("express");
const router = express.Router();
const adminMessageController = require("../../controllers/adminMessageController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Admin), adminMessageController.getAllMessages)
  .post(adminMessageController.sendMessage);

router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.Admin), adminMessageController.getMessage)
  .delete(verifyRoles(ROLES_LIST.Admin), adminMessageController.deleteMessage)
  .put(verifyRoles(ROLES_LIST.Admin), adminMessageController.markSolved);

module.exports = router;
