const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    const errorMessage = errors.array()[0].msg;
    const field = errors.array()[0].path;
    return res.status(400).json({ message: errorMessage, field: field });
  }
  next();
};

module.exports = {
  validate,
};
