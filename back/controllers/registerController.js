const User = require('../model/User');
const bcrypt = require('bcrypt');
const validator = require('email-validator');
const mailerConfig = require('../config/mailerConfig');
require('dotenv').config();
const mongoose = require('mongoose');


const handleNewUser = async (req, res) => {
    const { newMatricule, email, firstname, lastname, department, role, selectedBots } = req.body;
    const matricule = newMatricule;
    if (!matricule || !email || !firstname || !lastname || !department  || !role) {
        return res.status(400).json({ 'message': 'Missing required fields.' });
    }

    if (!validator.validate(email)) {
        return res.status(400).json({ 'message': 'Invalid email' });
    }

    try {

        const duplicateEmail = await User.findOne({ email: email }).exec();
        if (duplicateEmail) {
            return res.status(409).json({'message': 'Email already in use'}); 
        }
        const dupliacteMatricule = await User.findOne({ matricule: matricule }).exec();
        if (dupliacteMatricule) {
            return res.status(409).json({'message': 'Matricule already in use'});
        }

        const password = Math.random().toString(36).slice(-8);

        const hashedPwd = await bcrypt.hash(password, 10);

        const access = selectedBots.map(bot => bot.value);
        
        const result = await User.create({
            matricule: matricule ,
            email: email,
            firstname: firstname,
            lastname: lastname,
            department: department,
            password: hashedPwd,
            role: role,
            access: access,
            refreshToken: '',
            resetToken: ''
        });
    
        const mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: "Welcome to the app",
            text: `Welcome ${firstname} ${lastname}!
            Your account has been created successfully.
            Your login credentials are:
            Email: ${email}
            Password: ${password}`
        };
        
        mailerConfig.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        });

        res.status(201).json({ 'success': `New user ${firstname} ${lastname} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}



module.exports = { handleNewUser };