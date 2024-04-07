const Group = require('../model/Group');
const Bot = require('../model/Bot');

const createGroup = async (req, res) => {
    const { name, botIds } = req.body;

    try {
        const existingGroup = await Group.findOne({ name });
        if (existingGroup) {
            return res.status(400).json({ message: 'Group name already exists' });
        }

        const group = new Group({
            name,
            bots: botIds
        });

        const savedGroup = await group.save();

        res.json(savedGroup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getAllGroups = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const searchOption = req.query.searchOption || 'all';

    try {
        let query = {};
        if (search !== '') {
            if (searchOption === 'all') {
                query = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                    ]
                };
            } else {
                query[searchOption] = { $regex: search, $options: 'i' };
            }
        }

        const options = {
            page,
            limit,
        };

        const groups = await Group.paginate(query, options);

        if (!groups || groups.docs.length === 0) {
            return res.status(204).json({ message: 'No groups found' });
        }

        res.json({
            groups: groups.docs,
            currentPage: groups.page,
            totalPages: groups.totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getGroup = async (req, res) => {
    const groupId = req.params.id;

    try {
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateGroup = async (req, res) => {
    const groupId = req.params.id;
    const { name, botIds } = req.body;

    try {
        const updatedGroup = await Group.findByIdAndUpdate(groupId, { name, bots: botIds }, { new: true });

        if (!updatedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.json(updatedGroup);
    } catch (error) {
        console.error(error);
        const message = error.code === 11000 ? 'Group name already exists' : 'Internal server error';
        res.status(500).json({ message });
    }
};

const deleteGroup = async (req, res) => {
    const groupId = req.params.id;

    try {
        const deletedGroup = await Group.findByIdAndDelete(groupId);

        if (!deletedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getBotsByGroup = async (req, res) => {
    const groupId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const searchOption = req.query.searchOption || 'all';

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const botIds = group.bots.map(botId => botId.toString());

        let query = { _id: { $in: botIds } };
        if (search !== '') {
            if (searchOption === 'all') {
                query = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                    ]
                };
            } else {
                query[searchOption] = { $regex: search, $options: 'i' };
            }
        }

        const options = {
            page,
            limit,
        };


        const bots = await Bot.paginate(query, options);

        if (!bots || bots.docs.length === 0) {
            return res.status(204).json({ message: 'No bots found' });
        }


        res.json({
            bots: bots.docs,
            currentPage: bots.page,
            totalPages: bots.totalPages
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    createGroup,
    getAllGroups,
    getGroup,
    updateGroup,
    deleteGroup,
    getBotsByGroup
};
