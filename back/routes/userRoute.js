const express = require('express');
const router = express.Router();

//controler functions
const { signupUser, loginUser, getUsers } = require('../controllers/userController');

//model
const User = require('../models/userModel');


router.post('/login', loginUser)

router.get('/', getUsers)

router.post('/signup', signupUser)



module.exports = router;