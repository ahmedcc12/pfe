const { validationResult } = require('express-validator');


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array()[0].msg);
        const errorMessage = errors.array()[0].msg;
        console.log(errorMessage);
        return res.status(400).json({ message: errorMessage });
    }
    next();
};


module.exports = {
    validate
};