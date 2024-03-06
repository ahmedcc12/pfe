const User = require('../model/User');
const mailerConfig = require('../config/mailerConfig');
require('dotenv').config();
const bcrypt = require('bcrypt');
const passwordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');


const handleForgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ 'message': 'email is required.' });

    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) {
        return res.status(404).json({ 'message': `email not found` });
    }

    const resetToken = jwt.sign({ _id : foundUser._id }, process.env.RESET_TOKEN_SECRET, { expiresIn: '2h' });

    
    foundUser.resetToken = resetToken;
    
    await foundUser.save();

    const mailOptions = {
        from: process.env.MAIL,
        to: email,
        subject: "Password recovery",
        text: `Hello ${foundUser.username}!
        You requested a password recovery.
        Please click on the following link to reset your password:
        ${process.env.FRONT_URL}/resetpassword/${resetToken}
        `
    };
    
    mailerConfig.transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });

    res.json({ 'message': 'Email sent' });
    
}

    const handleResetPassword = async (req, res) => {
        const { token, newPassword ,confirmPassword} = req.body;

        console.log(token);
        console.log(newPassword);
        console.log(confirmPassword);

        if (!token) return res.status(400).json({ 'message': 'Token is required.' });



        jwt.verify(token, process.env.RESET_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ 'message': 'Invalid or expired token' });
            }
            const foundUser = await User.findOne({ resetToken: token }).exec();
            if (!foundUser) {
                return res.status(204).json({ 'message': 'User not found' });
            }

            if (!newPassword) return res.status(400).json({ 'message': 'Password is required.' });

            if (newPassword !== confirmPassword) return res.status(400).json({ 'message': 'Passwords do match' });
            
            const complexityOptions = {
                min: 8,
                max: 30,
                lowerCase: 1,
                upperCase: 1,
                numeric: 1,
                symbol: 1,
                requirementCount: 4,
            };
            const { error } = passwordComplexity(complexityOptions).validate(newPassword);
            if (error) {
                return res.status(400).json({ 'message': error.details[0].message });
            }
            const hashedPwd = await bcrypt.hash(newPassword, 10);
            foundUser.password = hashedPwd;
            foundUser.resetToken = '';
            await foundUser.save();
            res.json({ 'message': 'Password updated' });
        });
    }

    const verifyToken = async (req, res) => {
        const token = req?.params?.token

        if (!token) return res.status(400).json({ 'message': 'Token is required.' });
        console.log(token);
        jwt.verify(token, process.env.RESET_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ 'message': 'Invalid or expired token' });
            }
            res.json({ 'message': 'Token is valid' });
        });
    }

module.exports = { handleForgotPassword , handleResetPassword, verifyToken};