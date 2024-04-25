const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passwordReset = require("../controllers/passwordReset");
const {
  loginValidationRules,
  forgotPasswordValidationRules,
  resetPasswordValidationRules,
} = require("../middleware/validators/authvalidator");
const { validationResult } = require("express-validator");
const { validate } = require("../middleware/validators/validate");

router.post("/", loginValidationRules(), validate, authController.handleLogin);
router.post(
  "/forgotpassword",
  forgotPasswordValidationRules(),
  validate,
  passwordReset.handleForgotPassword
);
router.post(
  "/resetpassword",
  resetPasswordValidationRules(),
  validate,
  passwordReset.handleResetPassword
);
router.get("/resetpassword/:token", passwordReset.verifyToken);

module.exports = router;
