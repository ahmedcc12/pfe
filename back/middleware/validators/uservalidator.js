const { check, param } = require("express-validator");

const getAllUsersValidationRules = () => {
  const validSearchOptions = [
    "all",
    "matricule",
    "email",
    "firstname",
    "lastname",
    "department",
    "role",
    "group",
  ];
  return [
    check("search")
      .optional()
      .isString()
      .withMessage("Search must be a string")
      .isLength({ max: 50 })
      .withMessage("Search query is too long"),
    check("searchOption")
      .optional()
      .escape()
      .isString()
      .withMessage("Search option must be a string")
      .isIn(validSearchOptions)
      .withMessage("Invalid search option"),
  ];
};

const UserValidationRules = () => {
  return [
    check("matricule")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Matricule is required")
      .isLength({ min: 4, max: 50 })
      .withMessage("Matricule must be at least 4 characters long"),
    check("email")
      .trim()
      .escape()
      .normalizeEmail()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .isLength({ max: 254 })
      .withMessage("Email is too long"),
    check("firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Firstname is required")
      .isAlpha()
      .withMessage("Firstname must contain only letters")
      .isLength({ min: 3, max: 20 })
      .withMessage("Firstname must be 3 to 20 characters long"),
    check("lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Lastname is required")
      .isAlpha()
      .withMessage("Firstname must contain only letters")
      .isLength({ min: 3, max: 20 })
      .withMessage("Lastname must be 3 to 20 characters long"),
    check("department")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Department is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Department must be 2 to 20 characters long"),
    check("role").trim().escape().notEmpty().withMessage("Role is required"),
    check("group").trim().escape().notEmpty().withMessage("Group is required"),
    check("avatarUrl")
      .custom((value, { req }) => {
        if (req?.file === undefined) {
          return true;
        }
        return (
          req?.file.mimetype === "image/jpeg" ||
          req?.file.mimetype === "image/jpg" ||
          req?.file.mimetype === "image/png" ||
          req?.file.mimetype === "image/gif"
        );
      })
      .withMessage("Invalid file type"),
  ];
};

// Validation rules for deleting a user
const paramUserValidationRules = () => {
  return [
    check("id").trim().escape().notEmpty().withMessage("Matricule is required"),
  ];
};

module.exports = {
  UserValidationRules,
  getAllUsersValidationRules,
  paramUserValidationRules,
};
