const User = require('../model/User');
const validator = require('email-validator');

const getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    try {
        let query = {};
        if (search !== '') {
            query = { $or: [{ email: { $regex: search, $options: 'i' } }] }; // Example search by email
        }

        const users = await User.find(query)
            .skip(skip)
            .limit(limit);
        
        const totalUsers = await User.countDocuments(query);

        if (!users || users.length === 0) {
            return res.status(204).json({ 'message': 'No users found' });
        }

        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Internal server error' });
    }
};


const deleteUser = async (req, res) => {
    if (!req?.params?._id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params._id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params._id} not found` });
    }
    const result = await user.deleteOne({ _id: req.params._id });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?._id) return res.status(400).json({ "message": 'User ID required' });
  
    try {
      const user = await User.findById(req.params._id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  


const updateUser = async (req, res) => {
    if (!req.params?._id) return res.status(400).json({ "message": 'User ID required' });

    const { matricule, email, firstname, lastname, department, role, access } = req.body;

    if (!matricule || !email || !firstname || !lastname || !department || !role) {
        return res.status(400).json({ 'message': 'Missing required fields.' });
    }

    if (!validator.validate(email)) {
        return res.status(400).json({ 'message': 'Invalid email' });
    }

    try {
        const userId = req.params._id;
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ 'message': `User with ID ${userId} not found` });
        }

        const emailChanged = existingUser.email !== email;
        const matriculeChanged = existingUser.matricule !== matricule;

        if (emailChanged) {
            const duplicateEmail = await User.findOne({ email });
            if (duplicateEmail) {
                return res.status(409).json({ 'message': 'Email already in use' });
            }
        }

        if (matriculeChanged) {
            const duplicateMatricule = await User.findOne({ matricule });
            if (duplicateMatricule) {
                return res.status(409).json({ 'message': 'Matricule already in use' });
            }
        }

        existingUser.matricule = matricule;
        existingUser.email = email;
        existingUser.firstname = firstname;
        existingUser.lastname = lastname;
        existingUser.department = department;
        existingUser.role = role;
        existingUser.access = access;

        const updatedUser = await existingUser.save();
        res.status(200).json({ 'success': `User ${updatedUser.username} was updated!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};



module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    updateUser
}