const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const {
  UserValidationRules,
  getAllUsersValidationRules,
  paramUserValidationRules,
} = require("../../middleware/validators/uservalidator");
const { validate } = require("../../middleware/validators/validate");
const upload = require("../../middleware/multer");

router
  .route("/")
  .get(
    verifyRoles(ROLES_LIST.Admin),
    getAllUsersValidationRules(),
    validate,
    usersController.getAllUsers
  );

router
  .route("/:id")
  .get(paramUserValidationRules(), validate, usersController.getUser)
  .delete(
    verifyRoles(ROLES_LIST.Admin),
    paramUserValidationRules(),
    validate,
    usersController.deleteUser
  )
  .put(
    verifyRoles(ROLES_LIST.Admin),
    upload.single("avatarUrl"),
    paramUserValidationRules(),
    UserValidationRules(),
    validate,
    usersController.updateUser
  );

module.exports = router;
