const { check, param } = require("express-validator");

const createBotInstancesValidationRules = () => {
  return [
    check("bot").trim().escape().notEmpty().withMessage("BotId is required"),
    check("user").trim().escape().notEmpty().withMessage("UserId is required"),
    /*     check("file")
      .custom((value, { req }) => {
        if (!req.file) throw new Error("Config is required");
        console.log(req.file.mimetype);
        return req.file.mimetype === "application/json";
      })
      .withMessage("Invalid file type"),*/
  ];
};

const paramBotInstanceValidationRules = () => {
  return [
    param("id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("BotInstanceId is required"),
  ];
};

const scheduleBotValidationRules = () => {
  return [
    check("scheduled")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("BotId is required"),
  ];
};

const userIdValidationRules = () => {
  return [
    param("userid")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("UserId is required"),
  ];
};

const userAndBotIdsValidationRules = () => {
  return [
    param("userid")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("UserId is required"),
    param("botid").trim().escape().notEmpty().withMessage("BotId is required"),
  ];
};

module.exports = {
  createBotInstancesValidationRules,
  paramBotInstanceValidationRules,
  scheduleBotValidationRules,
  userIdValidationRules,
  userAndBotIdsValidationRules,
};
