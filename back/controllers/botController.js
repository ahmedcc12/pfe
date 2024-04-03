const Bot = require('../model/Bot');
const { uploadFile, deleteFile } = require('../middleware/file');
const Group = require('../model/Group');

const getAllBots = async (req, res) => {
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
                        { description: { $regex: search, $options: 'i' } },
                        { status: { $regex: search, $options: 'i' } }
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

const createBot = async (req, res) => {
    const { newName, description } = req.body;
    const name = newName;
    const file = req.file;
    const status = 'inactive'
    if (!name || !description || !file) {
        return res.status(400).json({ 'message': 'Missing required fields' });
    }
    try {
        const bot = await Bot.findOne({ name }).exec();
        if (bot) return res.status(400).json({ 'message': 'Bot name already exists' });

        const data = await uploadFile(file, "Script");
        const { path, downloadURL } = data;

        if (data?.status === 500) return res.status(500).json({ 'message': 'Internal server error' });

        const newBot = new Bot({
            name,
            description,
            configuration: { downloadURL, path },
            status
        });

        const result = await newBot.save();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Internal server error' });
    }
};

const deleteBot = async (req, res) => {
    if (!req?.params?.name) return res.status(400).json({ "message": 'Bot name required' });

    try {
        const bot = await Bot.findOne({ name: req.params.name }).exec();

        if (!bot) {
            return res.status(404).json({ 'message': `Bot name ${req.params.name} not found` });
        }

        const filePath = bot.configuration.path;

        const result = await bot.deleteOne({ name: req.params.name });

        await deleteFile(filePath);

        //remove bot id from its associated groups
        const groups = await Group.find({ bots: bot._id }).exec();

        groups.forEach(async group => {
            group.bots = group.bots.filter(id => id.toString() !== bot._id.toString());
            await group.save();
        });

        res.json(result);
    } catch (error) {
        console.error('Error deleting bot:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const getBot = async (req, res) => {
    if (!req?.params?.name) return res.status(400).json({ "message": 'Bot name required' });
    try {
        const bot = await Bot.findOne({ name: req.params.name }).exec();
        if (!bot) {
            return res.status(404).json({ 'message': `Bot name ${req.params.name} not found` });
        }
        res.json(bot);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Internal server error' });
    }
}

const updateBot = async (req, res) => {
    if (!req?.params?.name) return res.status(400).json({ "message": 'Bot name required' });
    const name = req.params.name;
    const bot = await Bot.findOne({ name: req.params.name }).exec();
    if (!bot) {
        return res.status(404).json({ 'message': `Bot name ${req.params.name} not found` });
    }
    const { newName, description } = req.body;
    const file = req.file;

    if (!newName || !description) {
        return res.status(400).json({ 'message': 'Missing required fields' });
    }
    try {
        const existingBot = await Bot.findOne({ name }).exec();
        if (!existingBot) {
            return res.status(404).json({ 'message': `Bot with name ${name} not found` });
        }
        const namechanged = existingBot.name !== newName;
        if (namechanged) {
            const bot = await Bot.findOne({ name: newName }).exec();
            if (bot) return res.status(400).json({ 'message': `Name ${newName} already exists` });
        }

        existingBot.name = newName;
        existingBot.description = description;
        if (file) {
            if (existingBot.configuration.path) {
                const filePath = existingBot.configuration.path;
                await deleteFile(filePath);
            }
            const data = await uploadFile(file, "configuration");
            const { path, downloadURL } = data;
            if (data?.status === 500) return res.status(500).json({ 'message': 'Internal server error' });
            existingBot.configuration = { downloadURL, path };
        }
        const result = await existingBot.save();
        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Internal server error' });
    }
}



module.exports = {
    getAllBots,
    createBot,
    deleteBot,
    getBot,
    updateBot
};