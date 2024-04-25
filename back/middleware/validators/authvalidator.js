const { check, param } = require("express-validator");

const loginValidationRules = () => {
  return [
    check("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isLength({ max: 254 })
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email"),
    check("pwd")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ max: 100 }),
  ];
};

const forgotPasswordValidationRules = () => {
  return [
    check("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email")
      .isLength({ max: 254 }),
  ];
};

const resetPasswordValidationRules = () => {
  return [
    check("token").trim().notEmpty().withMessage("Token is required"),
    check("newPassword")
      .exists()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password is too short - should be 8 chars minimum.")
      .isLength({ max: 30 })
      .withMessage("Password is too long - should be 30 chars maximum.")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase char.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase char.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number.")
      .matches(/[^a-zA-Z0-9]/)
      .withMessage("Password must contain at least one symbol.")
      .custom((value) => {
        let score = 0;
        if (/[a-z]/.test(value)) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^a-zA-Z0-9]/.test(value)) score++;
        if (score < 4) {
          throw new Error(
            "Password must meet at least 4 complexity requirements."
          );
        }
        return true;
      }),
    check("confirmPassword")
      .exists()
      .withMessage("Confirm Password is required")
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("Passwords must match");
        }
        return true;
      }),
  ];
};

module.exports = {
  loginValidationRules,
  forgotPasswordValidationRules,
  resetPasswordValidationRules,
};
