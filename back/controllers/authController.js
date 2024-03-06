const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailerConfig = require('../config/mailerConfig');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'email and password are required.' });

    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) {
        return res.sendStatus(401); //Unauthorized 
    }
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const role = foundUser.role;
        const access = foundUser.access;
        const matricule = foundUser.matricule;
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "matricule": foundUser.matricule,
                    "role": role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        );
        const refreshToken = jwt.sign(
            { "matricule": foundUser.matricule },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user

        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to user
        res.json({ matricule ,role, accessToken , access});

        console.log("User logged in");
        

    } else {
        res.sendStatus(401);
    }
}


module.exports = { handleLogin ,};