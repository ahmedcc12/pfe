const { check, param } = require("express-validator");

const GroupValidationRules = () => {
  return [
    check("name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3, max: 10 })
      .withMessage(
        "Name must be at least 3 characters long and at most 10 characters long"
      ),
    check("botIds")
      .isArray({ min: 1 })
      .withMessage("At least one bot is required"),
  ];
};

const paramGroupValidationRules = () => {
  return [
    param("id").trim().escape().notEmpty().withMessage("groupId is required"),
  ];
};

const getGroupBotsValidationRules = () => {
  const validSearchOptions = ["all", "name", "description"];
  return [
    check("search")
      .escape()
      .optional()
      .isString()
      .withMessage("Search must be a string")
      .isLength({ max: 50 })
      .withMessage("Search query is too long"),
    check("searchOption")
      .escape()
      .optional()
      .isString()
      .withMessage("Search option must be a string")
      .isIn(validSearchOptions)
      .withMessage("Invalid search option"),
  ];
};

module.exports = {
  GroupValidationRules,
  paramGroupValidationRules,
  getGroupBotsValidationRules,
};
