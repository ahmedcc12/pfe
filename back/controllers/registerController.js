const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { email ,user, pwd, role, access, userrole } = req.body;
    
    //if (userrole !== 'admin') return res.status(401).json({ 'message': 'Unauthorized' });
    if (!email || !user || !pwd) return res.status(400).json({ 'message': 'Email , Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    // check if email is already in use
    const duplicateEmail = await User.findOne({ email: email }).exec();
    if (duplicate || duplicateEmail) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //create and store the new user
        const result = await User.create({
            "email" : email,
            "name": user,
            "password": hashedPwd,
            "role": role,
            "access": access
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };