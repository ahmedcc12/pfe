const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");
const {
  UserValidationRules,
} = require("../middleware/validators/uservalidator");
const { validate } = require("../middleware/validators/validate");
const upload = require("../middleware/multer");

router
  .route("/")
  .post(
    verifyRoles(ROLES_LIST.Admin),
    upload.single("avatarUrl"),
    UserValidationRules(),
    validate,
    registerController.handleNewUser
  );

module.exports = router;
