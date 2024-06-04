const { check, param } = require("express-validator");

const getAllBotsValidationRules = () => {
  const validSearchOptions = ["all", "name", "description", "status"];
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

const BotValidationRules = () => {
  return [
    check("name")
      .trim()
      .escape()
      .escape()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3, max: 20 })
      .withMessage(
        "Name must be at least 3 characters long and at most 20 characters long"
      ),
    check("description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 4, max: 200 })
      .withMessage(
        "Description must be at least 4 characters long and at most 200 characters long"
      ),
    check("guide")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Guide is required")
      .isLength({ min: 10 })
      .withMessage("Guide must be at least 10 characters"),
    /*     check("file")
      .custom((value, { req }) => {
        if (!req.file) throw new Error("File is required");
        return (
          req.file.mimetype === "application/x-python-code" || "text/x-python"
        );
      })
      .withMessage("Invalid file type"), */
  ];
};

const paramBotValidationRules = () => {
  return [
    param("id").trim().escape().notEmpty().withMessage("botId is required"),
  ];
};

const botStatusValidationRules = () => {
  const statusOptions = ["active", "inactive"];
  return [
    check("status")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Status is required")
      .isIn(statusOptions)
      .withMessage("Invalid status"),
  ];
};

module.exports = {
  BotValidationRules,
  getAllBotsValidationRules,
  paramBotValidationRules,
  botStatusValidationRules,
};
