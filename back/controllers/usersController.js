const User = require('../model/User');
const validator = require('email-validator');


const getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const searchOption = req.query.searchOption || 'all';


    try {
        let query = {};

        if (searchOption === 'group') {
            const groupQuery = await Group.findOne({ name: { $regex: search, $options: 'i' } }).select('_id');
            if (groupQuery) {
                query.group = groupQuery._id;
            } else {
                return res.status(204).json({ 'message': 'No users found' });
            }
        } else {
            if (search !== '') {
                if (searchOption === 'all') {
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
                } else {
                    query[searchOption] = { $regex: search, $options: 'i' };
                }
            }
        }

        const options = {
            page,
            limit,
            populate: 'group'
        };

        const users = await User.paginate(query, options);

        if (!users || users.docs.length === 0) {
            return res.status(204).json({ 'message': 'No users found' });
        }

        res.json({
            users: users.docs,
            currentPage: users.page,
            totalPages: users.totalPages
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
        return res.status(404).json({ 'message': `User ID ${req.params.matricule} not found` });
    }
    const result = await user.deleteOne({ matricule: req.params.matricule });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.matricule) return res.status(400).json({ "message": 'User ID required' });
    console.log("fetching user ...")
    try {
        const user = await User.findOne({ matricule: req.params.matricule }).populate('group').exec();
        if (!user) {
            console.log('User not found');
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

    const { newMatricule, email, firstname, lastname, department, role, group } = req.body;

    if (!newMatricule || !email || !firstname || !lastname || !department || !role || !group) {
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
            const duplicateMatricule = await User.findOne({ matricule: newMatricule });
            if (duplicateMatricule) {
                return res.status(409).json({ 'message': 'Matricule already in use' });
            }
        }

        //const access = selectedBots.map(bot => bot.value);


        existingUser.matricule = newMatricule;
        existingUser.email = email;
        existingUser.firstname = firstname;
        existingUser.lastname = lastname;
        existingUser.department = department;
        existingUser.role = role;
        existingUser.group = group;

        const updatedUser = await existingUser.save();
        res.status(200).json({ 'success': `User ${updatedUser.matricule} was updated!` });
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