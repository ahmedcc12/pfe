const User = require('../model/User');
const bcrypt = require('bcrypt');
const validator = require('email-validator');
const mailerConfig = require('../config/mailerConfig');
require('dotenv').config();


const handleNewUser = async (req, res) => {
    const { newMatricule, email, firstname, lastname, department, role, group } = req.body;
    const matricule = newMatricule;
    if (!matricule || !email || !firstname || !lastname || !department || !role || !group) {
        return res.status(400).json({ 'message': 'Missing required fields.' });
    }

    if (!validator.validate(email)) {
        return res.status(400).json({ 'message': 'Invalid email' });
    }

    try {

        const duplicateEmail = await User.findOne({ email: email }).exec();
        if (duplicateEmail) {
            return res.status(409).json({ 'message': 'Email already in use' });
        }
        const dupliacteMatricule = await User.findOne({ matricule: matricule }).exec();
        if (dupliacteMatricule) {
            return res.status(409).json({ 'message': 'Matricule already in use' });
        }

        const password = Math.random().toString(36).slice(-8);

        const hashedPwd = await bcrypt.hash(password, 10);

        const mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: "Welcome to the app",
            text:
                `Hello ${firstname} ${lastname},\n\n` +
                `You have been added to the app as a ${role}.\n\n` +
                `Your matricule is: ${matricule}\n` +
                `Your password is: ${password}\n\n` +
                `Please login to the app and change your password.\n\n` +
                `Best regards,\n\n` +
                `The app team`
        };

        mailerConfig.transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                res.status(500).json({ 'message': err.message });
            } else {
                const result = await User.create({
                    matricule: matricule,
                    email: email,
                    firstname: firstname,
                    lastname: lastname,
                    department: department,
                    password: hashedPwd,
                    role: role,
                    group: group,
                    refreshToken: '',
                    resetToken: ''
                });
                res.status(201).json({ 'success': `New user ${firstname} ${lastname} created!` });
            }
        });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}



module.exports = { handleNewUser };