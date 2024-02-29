
const user = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createtoken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, {
        expiresIn: '3d'
    });
}

const loginUser= async (req, res) => {
    const { email, password } = req.body;
    try {
        const loguser = await user.login(email, password);
        const token = createtoken(loguser._id);
        res.status(200).json({email,token,role : loguser.role, access: loguser.access});
    } catch (error) {
        res.status(400).json({message: error.message});
    } 
}

const signupUser= async (req, res) => {
    const { email, name, password, role, access ,userrole} = req.body;

   if(userrole !== 'admin'){
        return res.status(400).json({message: 'unauthorized user'});
    }
    try {
        const newUser = await user.signup(email, name, password, role, access);
        res.status(201).json({message: 'User created', newUser});
    } catch (error) {
        res.status(400).json({message: error.message});
    } 
}

const getUsers = async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

module.exports = { loginUser, signupUser , getUsers};