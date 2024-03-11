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
            query = {
                $or: [
                    { matricule: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { firstname: { $regex: search, $options: 'i' } },
                    { lastname: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { role: { $regex: search, $options: 'i' } }
                ]
            };
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
    if (!req?.params?.matricule) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ matricule: req.params.matricule }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.matricule} not found` });
    }
    const result = await user.deleteOne({ matricule: req.params.matricule });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.matricule) return res.status(400).json({ "message": 'User ID required' });
  
    try {
        const user = await User.findOne({ matricule: req.params.matricule }).populate('access').exec();
        if (!user) {
        console.log('User not founddd');
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  


const updateUser = async (req, res) => {
    if (!req.params?.matricule) return res.status(400).json({ "message": 'User ID required' });

    const { newMatricule, email, firstname, lastname, department, role, selectedBots } = req.body;

    if (!newMatricule || !email || !firstname || !lastname || !department || !role) {
        return res.status(400).json({ 'message': 'Missing required fields.' });
    }

    if (!validator.validate(email)) {
        return res.status(400).json({ 'message': 'Invalid email' });
    }

    try {

        const existingUser = await User.findOne({ matricule: req.params.matricule }).exec();

        if (!existingUser) {
            return res.status(404).json({ 'message': `User with ID ${matricule} not found` });
        }

        const emailChanged = existingUser.email !== email;
        const matriculeChanged = existingUser.matricule !== newMatricule;

        if (emailChanged) {
            const duplicateEmail = await User.findOne({ email });
            if (duplicateEmail) {
                return res.status(409).json({ 'message': 'Email already in use' });
            }
        }

        if (matriculeChanged) {
            const duplicateMatricule = await User.findOne({ matricule: newMatricule});
            if (duplicateMatricule) {
                return res.status(409).json({ 'message': 'Matricule already in use' });
            }
        }

        const access = selectedBots.map(bot => bot.value);

    
        existingUser.matricule = newMatricule;
        existingUser.email = email;
        existingUser.firstname = firstname;
        existingUser.lastname = lastname;
        existingUser.department = department;
        existingUser.role = role;
        existingUser.access = access;

        const updatedUser = await existingUser.save();
        res.status(200).json({ 'success': `User ${updatedUser.matricule} was updated!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

const getUserBots = async (req, res) => {
    if (!req?.query?.matricule) return res.status(400).json({ "message": 'User ID required' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    try {
        console.log("Query parameters:", req.query);
        let userQuery = User.aggregate([
            { $match: { matricule: req.query.matricule } },
            {
                $lookup: {
                    from: "bots",
                    localField: "access",
                    foreignField: "_id",
                    as: "access"
                }
            },
            {
                $project: {
                    access: {
                        $filter: {
                            input: "$access",
                            as: "bot",
                            cond: {
                                $or: [
                                    { $regexMatch: { input: "$$bot.name", regex: search, options: "i" } },
                                    { $regexMatch: { input: "$$bot.description", regex: search, options: "i" } }
                                ]
                            }
                        }
                    }
                }
            },
            { $unwind: "$access" },
            { $replaceRoot: { newRoot: "$access" } },
            { $skip: skip },
            { $limit: limit }
        ]);
        
        

        const user = await userQuery.exec();

        if (!user || user.length === 0) {
            return res.status(204).json({ 'message': `User ID ${req.query.matricule} not found` });
        }
        
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Internal server error' });
    }
}



module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    updateUser,
    getUserBots
}